from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from app_users.models import Profil, Entreprise

from .models import (
    Mission,
    CandidatureMission,
)

from .serializers import (
    MissionSerializer,
    CandidatureMissionSerializer,
    CandidatureMissionStatutSerializer,
)


# ============================================================
# MISSIONS PUBLIQUES
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
# CANDIDATURES DU FREELANCE
# ============================================================

class CandidatureMissionViewSet(
    viewsets.ModelViewSet
):

    serializer_class = CandidatureMissionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # ========================================================
    # QUERYSET
    # ========================================================

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

    # ========================================================
    # CRÉER UNE CANDIDATURE
    # ========================================================

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


# ============================================================
# MISSIONS DU RECRUTEUR
# ============================================================

class RecruteurMissionViewSet(
    viewsets.ModelViewSet
):

    serializer_class = MissionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # ========================================================
    # MISSIONS DU RECRUTEUR CONNECTÉ
    # ========================================================

    def get_queryset(self):

        return (
            Mission.objects
            .filter(
                recruteur=self.request.user
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

    # ========================================================
    # CRÉATION D'UNE MISSION
    # ========================================================

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        # ----------------------------------------------------
        # VÉRIFIER LE PROFIL
        # ----------------------------------------------------

        try:

            profil = Profil.objects.get(
                user=request.user
            )

        except Profil.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Profil introuvable."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # VÉRIFIER LE RÔLE
        # ----------------------------------------------------

        if profil.role != "recruteur":

            return Response(
                {
                    "detail":
                    "Seul un recruteur peut créer une mission."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # ENTREPRISE
        # ----------------------------------------------------

        entreprise_id = request.data.get(
            "entreprise"
        )

        if not entreprise_id:

            return Response(
                {
                    "entreprise":
                    "L'entreprise est obligatoire."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # VÉRIFIER L'ENTREPRISE
        # ----------------------------------------------------

        try:

            entreprise = profil.entreprises.get(
                id=entreprise_id
            )

        except Entreprise.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Vous n'êtes pas associé à cette entreprise."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # ----------------------------------------------------
        # CRÉER LA MISSION
        # ----------------------------------------------------

        mission = serializer.save(
            recruteur=request.user,
            entreprise=entreprise
        )

        # ----------------------------------------------------
        # RÉPONSE
        # ----------------------------------------------------

        return Response(
            MissionSerializer(
                mission,
                context={
                    "request": request
                }
            ).data,
            status=status.HTTP_201_CREATED
        )

    # ========================================================
    # MODIFICATION D'UNE MISSION
    # ========================================================

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        mission = self.get_object()

        # ----------------------------------------------------
        # SÉCURITÉ
        # ----------------------------------------------------

        if mission.recruteur != request.user:

            return Response(
                {
                    "detail":
                    "Vous n'êtes pas autorisé à modifier cette mission."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # ENTREPRISE
        # ----------------------------------------------------

        entreprise_id = request.data.get(
            "entreprise"
        )

        if entreprise_id:

            try:

                profil = Profil.objects.get(
                    user=request.user,
                    role="recruteur"
                )

                entreprise = profil.entreprises.get(
                    id=entreprise_id
                )

            except (
                Profil.DoesNotExist,
                Entreprise.DoesNotExist
            ):

                return Response(
                    {
                        "detail":
                        "Vous n'êtes pas associé à cette entreprise."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        else:

            entreprise = mission.entreprise

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        serializer = self.get_serializer(
            mission,
            data=request.data,
            partial=kwargs.pop(
                "partial",
                False
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        # ----------------------------------------------------
        # SAUVEGARDE
        # ----------------------------------------------------

        mission = serializer.save(
            recruteur=request.user,
            entreprise=entreprise
        )

        return Response(
            MissionSerializer(
                mission,
                context={
                    "request": request
                }
            ).data
        )

    # ========================================================
    # SUPPRESSION
    # ========================================================

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        mission = self.get_object()

        if mission.recruteur != request.user:

            return Response(
                {
                    "detail":
                    "Vous n'êtes pas autorisé à supprimer cette mission."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        mission.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    # ========================================================
    # FERMER UNE MISSION
    # POST /missions-recruteur/{id}/fermer/
    # ========================================================

    @action(
        detail=True,
        methods=["post"]
    )
    def fermer(
        self,
        request,
        pk=None
    ):

        mission = self.get_object()

        if mission.recruteur != request.user:

            return Response(
                {
                    "detail":
                    "Accès refusé."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # VÉRIFIER SI DÉJÀ FERMÉE
        # ----------------------------------------------------

        if mission.statut == "fermee":

            return Response(
                {
                    "detail":
                    "Cette mission est déjà fermée."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # FERMER
        # ----------------------------------------------------

        mission.statut = "fermee"

        mission.save(
            update_fields=[
                "statut",
                "updated_at"
            ]
        )

        return Response(
            {
                "message":
                "Mission fermée avec succès."
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# CANDIDATURES REÇUES PAR LE RECRUTEUR
# ============================================================

class RecruteurCandidatureMissionViewSet(
    viewsets.ModelViewSet
):

    serializer_class = CandidatureMissionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # ========================================================
    # CANDIDATURES DES MISSIONS DU RECRUTEUR
    # ========================================================

    def get_queryset(self):

        return (
            CandidatureMission.objects
            .filter(
                mission__recruteur=self.request.user
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

    # ========================================================
    # MODIFIER LE STATUT
    # ========================================================

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        candidature = self.get_object()

        # ----------------------------------------------------
        # SÉCURITÉ
        # ----------------------------------------------------

        if candidature.mission.recruteur != request.user:

            return Response(
                {
                    "detail":
                    "Vous n'êtes pas autorisé à modifier cette candidature."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # VALIDATION DU STATUT
        # ----------------------------------------------------

        serializer = (
            CandidatureMissionStatutSerializer(
                candidature,
                data=request.data,
                partial=True
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        # ----------------------------------------------------
        # RÉPONSE
        # ----------------------------------------------------

        return Response(
            CandidatureMissionSerializer(
                candidature,
                context={
                    "request": request
                }
            ).data
        )

    # ========================================================
    # ACCEPTER UNE CANDIDATURE
    # ========================================================

    @action(
        detail=True,
        methods=["post"]
    )
    def accepter(
        self,
        request,
        pk=None
    ):

        candidature = self.get_object()

        mission = candidature.mission

        # ----------------------------------------------------
        # SÉCURITÉ
        # ----------------------------------------------------

        if mission.recruteur != request.user:

            return Response(
                {
                    "detail":
                    "Accès refusé."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # VÉRIFIER LE STATUT
        # ----------------------------------------------------

        if candidature.statut == "acceptee":

            return Response(
                {
                    "detail":
                    "Cette candidature est déjà acceptée."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # ACCEPTER
        # ----------------------------------------------------

        candidature.statut = "acceptee"

        candidature.save(
            update_fields=[
                "statut",
                "updated_at"
            ]
        )

        # ----------------------------------------------------
        # RETENIR LE FREELANCE
        # ----------------------------------------------------

        mission.freelance = candidature.freelance

        mission.statut = "en_cours"

        mission.save(
            update_fields=[
                "freelance",
                "statut",
                "updated_at"
            ]
        )

        # ----------------------------------------------------
        # REFUSER LES AUTRES CANDIDATURES
        # ----------------------------------------------------

        CandidatureMission.objects.filter(
            mission=mission
        ).exclude(
            id=candidature.id
        ).update(
            statut="refusee"
        )

        return Response(
            {
                "message":
                "Freelance sélectionné avec succès."
            },
            status=status.HTTP_200_OK
        )

    # ========================================================
    # REFUSER UNE CANDIDATURE
    # ========================================================

    @action(
        detail=True,
        methods=["post"]
    )
    def refuser(
        self,
        request,
        pk=None
    ):

        candidature = self.get_object()

        # ----------------------------------------------------
        # SÉCURITÉ
        # ----------------------------------------------------

        if candidature.mission.recruteur != request.user:

            return Response(
                {
                    "detail":
                    "Accès refusé."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # VÉRIFIER SI DÉJÀ ACCEPTÉE
        # ----------------------------------------------------

        if candidature.statut == "acceptee":

            return Response(
                {
                    "detail":
                    "Une candidature déjà acceptée ne peut pas être refusée."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # REFUSER
        # ----------------------------------------------------

        candidature.statut = "refusee"

        candidature.save(
            update_fields=[
                "statut",
                "updated_at"
            ]
        )

        return Response(
            {
                "message":
                "Candidature refusée avec succès."
            },
            status=status.HTTP_200_OK
        )