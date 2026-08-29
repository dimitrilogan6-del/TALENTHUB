from rest_framework import (
    serializers,
    viewsets,
    permissions,
    status
)

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


# ============================================================
# ENTREPRISE
# ============================================================

class EntrepriseViewSet(
    viewsets.ModelViewSet
):

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

    def perform_create(
        self,
        serializer
    ):

        entreprise = serializer.save(

            statut="en_attente",

            verifiee=False

        )


# ============================================================
# COMPETENCE
# ============================================================

class CompetenceViewSet(
    viewsets.ModelViewSet
):

    queryset = Competence.objects.all()

    serializer_class = CompetenceSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]


# ============================================================
# OFFRE
# ============================================================

class OffreViewSet(
    viewsets.ModelViewSet
):

    serializer_class = OffreSerializer

    # ========================================================
    # PERMISSIONS
    # ========================================================

    def get_permissions(self):

        # ----------------------------------------------------
        # Tout le monde peut consulter les offres
        # ----------------------------------------------------

        if self.action in [
            "list",
            "retrieve"
        ]:

            return [
                permissions.AllowAny()
            ]

        # ----------------------------------------------------
        # Création / modification / suppression
        # ----------------------------------------------------

        return [
            permissions.IsAuthenticated()
        ]

    # ========================================================
    # LISTE DES OFFRES
    # ========================================================

    def get_queryset(self):

        return (
            Offre.objects
            .select_related(
                "entreprise",
                "recruteur"
            )
            .prefetch_related(
                "niveaux_competences__competence"
            )
            .order_by(
                "-created_at"
            )
        )

    # ========================================================
    # CREATION
    # ========================================================

    def perform_create(
        self,
        serializer
    ):

        user = self.request.user

        # ----------------------------------------------------
        # Vérifier le profil
        # ----------------------------------------------------

        try:

            profil = user.profil

        except Exception:

            raise serializers.ValidationError({

                "entreprise":
                "Votre profil recruteur est introuvable."

            })

        # ----------------------------------------------------
        # Récupérer l'entreprise
        # ----------------------------------------------------

        entreprise = (
            serializer.validated_data.get(
                "entreprise"
            )
        )

        if not entreprise:

            raise serializers.ValidationError({

                "entreprise":
                "Veuillez sélectionner une entreprise."

            })

        # ----------------------------------------------------
        # Vérifier l'association avec l'entreprise
        # ----------------------------------------------------

        if not user.is_staff:

            association = (
                profil.associations_entreprises
                .filter(
                    entreprise=entreprise,
                    actif=True
                )
                .exists()
            )

            if not association:

                raise serializers.ValidationError({

                    "entreprise":
                    "Vous n'êtes pas associé à cette entreprise."

                })

        # ----------------------------------------------------
        # Création de l'offre
        # ----------------------------------------------------

        serializer.save(

            recruteur=user,

            entreprise=entreprise

        )

    # ========================================================
    # MODIFICATION
    # ========================================================

    def perform_update(
        self,
        serializer
    ):

        offre = self.get_object()

        user = self.request.user

        # ----------------------------------------------------
        # Vérifier le profil
        # ----------------------------------------------------

        try:

            profil = user.profil

        except Exception:

            raise serializers.ValidationError({

                "entreprise":
                "Votre profil recruteur est introuvable."

            })

        # ----------------------------------------------------
        # Entreprise actuelle ou nouvelle entreprise
        # ----------------------------------------------------

        entreprise = (
            serializer.validated_data.get(
                "entreprise",
                offre.entreprise
            )
        )

        # ----------------------------------------------------
        # Vérifier l'association
        # ----------------------------------------------------

        if not user.is_staff:

            association = (
                profil.associations_entreprises
                .filter(
                    entreprise=entreprise,
                    actif=True
                )
                .exists()
            )

            if not association:

                raise serializers.ValidationError({

                    "entreprise":
                    "Vous n'êtes pas associé à cette entreprise."

                })

        # ----------------------------------------------------
        # Mise à jour
        # ----------------------------------------------------

        serializer.save(

            recruteur=offre.recruteur,

            entreprise=entreprise

        )

# ============================================================
# NIVEAU COMPETENCE OFFRE
# ============================================================

class NiveauCompetenceOffreViewSet(
    viewsets.ModelViewSet
):

    serializer_class = (
        NiveauCompetenceOffreSerializer
    )

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # ========================================================
    # LISTE
    # ========================================================

    def get_queryset(self):

        return (
            NiveauCompetenceOffre.objects
            .filter(
                offre__recruteur=self.request.user
            )
            .select_related(
                "offre",
                "competence"
            )
        )

    # ========================================================
    # CREATION
    # ========================================================

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

        # ----------------------------------------------------
        # Vérifier le propriétaire
        # ----------------------------------------------------

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

            self.get_serializer(
                niveau
            ).data,

            status=status.HTTP_201_CREATED

        )