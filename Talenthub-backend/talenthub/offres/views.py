from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Entreprise, Offre, Competence
from .serializers import EntrepriseSerializer, OffreSerializer, CompetenceSerializer

class EntrepriseViewSet(viewsets.ModelViewSet):
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CompetenceViewSet(viewsets.ModelViewSet):
    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class OffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all()
    serializer_class = OffreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        # Pour créer une offre, on récupère l'entreprise et le recruteur
        data = request.data
        # On vérifie que l'utilisateur est bien un recruteur
        if request.user.profil.role != 'recruteur':
            return Response(
                {"error": "Seul un recruteur peut publier une offre"},
                status=status.HTTP_403_FORBIDDEN
            )
        # On crée l'offre
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(recruteur=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


