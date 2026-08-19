from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from django.db.models import Count

from app_users.models import Profil

from .models import (
    Mission,
    CandidatureMission,
)

from .serializers import (
    MissionSerializer,
    CandidatureMissionSerializer,
)


# ============================================================
# MISSIONS
# ============================================================

class MissionViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = MissionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        return (
            Mission.objects
            .filter(
                statut="publiee"
            )
            .select_related(
                "entreprise",
                "recruteur",
                "freelance",
            )
            .prefetch_related(
                "competences"
            )
            .order_by(
                "-datePublication"
            )
        )


# ============================================================
# CANDIDATURES
# ============================================================

class CandidatureMissionViewSet(
    viewsets.ModelViewSet
):

    serializer_class = CandidatureMissionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # --------------------------------------------------------
    # CANDIDATURES DU FREELANCE CONNECTÉ
    # --------------------------------------------------------

    def get_queryset(self):

        return (
            CandidatureMission.objects
            .filter(
                freelance__user=self.request.user
            )
            .select_related(
                "mission",
                "mission__entreprise",
                "mission__recruteur",
                "freelance",
                "freelance__user",
            )
            .prefetch_related(
                "mission__competences"
            )
            .order_by(
                "-dateCandidature"
            )
        )

    # --------------------------------------------------------
    # CRÉER UNE CANDIDATURE
    # --------------------------------------------------------

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        print("====================================")
        print("POST CANDIDATURE REÇU")
        print("USER :", request.user)
        print("DATA :", request.data)
        print("====================================")

        # ----------------------------------------------------
        # RÉCUPÉRER LE PROFIL FREELANCE
        # ----------------------------------------------------

        try:

            profil = Profil.objects.get(
                user=request.user,
                role="freelance"
            )

        except Profil.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Profil freelance introuvable."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # RÉCUPÉRER LA MISSION
        # ----------------------------------------------------

        mission_id = request.data.get(
            "mission"
        )

        if not mission_id:

            return Response(
                {
                    "detail":
                    "La mission est obligatoire."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            mission = Mission.objects.get(
                id=mission_id,
                statut="publiee"
            )

        except Mission.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Mission introuvable ou non disponible."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------------------------------
        # VÉRIFIER SI DÉJÀ POSTULÉ
        # ----------------------------------------------------

        candidature_existante = (
            CandidatureMission.objects.filter(
                mission=mission,
                freelance=profil
            ).first()
        )

        if candidature_existante:

            return Response(
                {
                    "detail":
                    "Vous avez déjà postulé à cette mission."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # CRÉER LA CANDIDATURE
        # ----------------------------------------------------

        candidature = (
            CandidatureMission.objects.create(

                mission=mission,

                freelance=profil,

                proposition=request.data.get(
                    "proposition"
                ),

                montantPropose=request.data.get(
                    "montantPropose"
                ),

                devise=request.data.get(
                    "devise"
                ) or mission.deviseBudget,

                delaiPropose=request.data.get(
                    "delaiPropose"
                ),

            )
        )

        # ----------------------------------------------------
        # AUGMENTER LE NOMBRE DE CANDIDATS
        # ----------------------------------------------------

        mission.nombreCandidats = (
            mission.nombreCandidats or 0
        ) + 1

        mission.save(
            update_fields=[
                "nombreCandidats"
            ]
        )

        # ----------------------------------------------------
        # RÉPONSE
        # ----------------------------------------------------

        serializer = self.get_serializer(
            candidature
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )