from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import (
    viewsets,
    permissions,
    status
)
from rest_framework.permissions import AllowAny


from rest_framework.response import Response

from .models import (
    Entreprise,
    Offre,
    Competence,
    NiveauCompetenceOffre
)

from .serializers import (
    EntrepriseSerializer,
    OffreSerializer,
    CompetenceSerializer,
    NiveauCompetenceOffreSerializer
)




class EntrepriseViewSet(viewsets.ModelViewSet):

    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:

            return [
                permissions.AllowAny()
            ]

        return [
            permissions.IsAuthenticated()
        ]

    def perform_create(self, serializer):

        entreprise = serializer.save(
            statut="en_attente",
            verifiee=False
        )

        # L'administrateur devra ensuite valider
        # l'entreprise.


class CompetenceViewSet(viewsets.ModelViewSet):

    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

class OffreViewSet(viewsets.ReadOnlyModelViewSet):
    
    serializer_class = OffreSerializer

    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):

        return Offre.objects.all().order_by(
            "-id"
        )
class NiveauCompetenceOffreViewSet(
    viewsets.ModelViewSet
):

    serializer_class = (
        NiveauCompetenceOffreSerializer
    )

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        return NiveauCompetenceOffre.objects.filter(
            offre__recruteur=self.request.user
        )

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        offre_id = request.data.get(
            "offre"
        )

        try:

            offre = Offre.objects.get(
                id=offre_id
            )

        except Offre.DoesNotExist:

            return Response(
                {
                    "offre":
                    "Offre introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if (
            offre.recruteur != request.user
            and not request.user.is_staff
        ):

            return Response(
                {
                    "detail":
                    "Vous n'êtes pas autorisé "
                    "à modifier cette offre."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        niveau = serializer.save()

        return Response(
            self.get_serializer(niveau).data,
            status=status.HTTP_201_CREATED
        )