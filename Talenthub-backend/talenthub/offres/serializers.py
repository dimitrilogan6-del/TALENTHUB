from django.utils import timezone

from rest_framework import serializers

from .models import (
    Entreprise,
    Offre,
    Competence,
    NiveauCompetenceOffre
)


# ============================================================
# ENTREPRISE
# ============================================================

class EntrepriseSerializer(serializers.ModelSerializer):

    class Meta:

        model = Entreprise

        fields = "__all__"


# ============================================================
# COMPETENCE
# ============================================================

class CompetenceSerializer(serializers.ModelSerializer):

    class Meta:

        model = Competence

        fields = "__all__"


# ============================================================
# NIVEAU COMPETENCE OFFRE
# ============================================================

class NiveauCompetenceOffreSerializer(
    serializers.ModelSerializer
):

    competenceNom = serializers.CharField(
        source="competence.nom",
        read_only=True
    )

    class Meta:

        model = NiveauCompetenceOffre

        fields = [
            "id",
            "competence",
            "competenceNom",
            "niveauRequis",
            "estObligatoire"
        ]


# ============================================================
# OFFRE
# ============================================================

class OffreSerializer(
    serializers.ModelSerializer
):

    entrepriseDetail = EntrepriseSerializer(
        source="entreprise",
        read_only=True
    )

    competences = NiveauCompetenceOffreSerializer(
        source="niveaux_competences",
        many=True,
        read_only=True
    )

    recruteurNom = serializers.SerializerMethodField()

    class Meta:

        model = Offre

        fields = [
            "id",
            "titre",
            "description",
            "typeOffre",
            "localisation",
            "salaireMin",
            "salaireMax",
            "deviseSalaire",
            "datePublication",
            "dateLimite",
            "statut",

            # ENTREPRISE
            "entreprise",
            "entrepriseDetail",

            # RECRUTEUR
            "recruteur",
            "recruteurNom",

            # COMPETENCES
            "competences",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "recruteur",
            "datePublication",
            "created_at",
            "updated_at",
            "entrepriseDetail",
            "recruteurNom",
            "competences",
        ]

    # ========================================================
    # NOM RECRUTEUR
    # ========================================================

    def get_recruteurNom(self, obj):

        return (
            obj.recruteur.get_full_name()
            or obj.recruteur.username
        )

    # ========================================================
    # VALIDATION
    # ========================================================

    def validate(self, attrs):

        date_limite = attrs.get(
            "dateLimite"
        )

        if date_limite:

            if date_limite < timezone.now().date():

                raise serializers.ValidationError({

                    "dateLimite":
                    "La date limite ne peut pas être "
                    "dans le passé."

                })

        salaire_min = attrs.get(
            "salaireMin"
        )

        salaire_max = attrs.get(
            "salaireMax"
        )

        if (
            salaire_min is not None
            and salaire_max is not None
            and salaire_min > salaire_max
        ):

            raise serializers.ValidationError({

                "salaire":
                "Le salaire minimum ne peut pas dépasser "
                "le salaire maximum."

            })

        # ====================================================
        # VERIFICATION ENTREPRISE
        # ====================================================

        entreprise = attrs.get(
            "entreprise"
        )

        request = self.context.get(
            "request"
        )

        if entreprise and request:

            user = request.user

            if not user.is_staff:

                try:

                    profil = user.profil

                    association = (
                        profil.associations_entreprises
                        .filter(
                            entreprise=entreprise,
                            actif=True
                        )
                        .exists()
                    )

                except Exception:

                    association = False

                if not association:

                    raise serializers.ValidationError({

                        "entreprise":
                        "Vous n'êtes pas associé à cette entreprise."

                    })

        return attrs