from rest_framework import serializers

from .models import (
    Mission,
    CompetenceMission,
    CandidatureMission,
)


# ============================================================
# COMPÉTENCE
# ============================================================

class CompetenceMissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompetenceMission

        fields = [
            "id",
            "nom",
            "niveauRequis",
            "estObligatoire",
        ]

        read_only_fields = [
            "id",
        ]


# ============================================================
# ENTREPRISE
# ============================================================

class MissionEntrepriseSerializer(serializers.Serializer):

    id = serializers.IntegerField(
        read_only=True
    )

    nom = serializers.CharField(
        read_only=True
    )

    secteur = serializers.CharField(
        read_only=True,
        allow_null=True
    )

    logo = serializers.SerializerMethodField()

    def get_logo(self, obj):

        if not obj.logo:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.logo.url
            )

        return obj.logo.url


# ============================================================
# MISSION
# ============================================================

class MissionSerializer(serializers.ModelSerializer):

    entreprise = MissionEntrepriseSerializer(
        read_only=True
    )

    recruteur_nom = serializers.SerializerMethodField()

    competences = CompetenceMissionSerializer(
        many=True,
        read_only=True
    )

    est_active = serializers.ReadOnlyField()

    class Meta:

        model = Mission

        fields = [

            "id",

            "titre",
            "description",

            "typeMission",
            "domaine",

            "localisation",
            "modeTravail",

            "budgetMin",
            "budgetMax",
            "deviseBudget",

            "datePublication",
            "dateLimite",
            "dateDebut",
            "dateFinPrevue",

            "statut",

            "entreprise",
            "recruteur_nom",

            "freelance",

            "nombreCandidats",

            "competences",

            "est_active",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "datePublication",
            "nombreCandidats",
            "created_at",
            "updated_at",
            "est_active",
        ]

    def get_recruteur_nom(self, obj):

        nom = (
            f"{obj.recruteur.first_name} "
            f"{obj.recruteur.last_name}"
        ).strip()

        if nom:
            return nom

        return obj.recruteur.username


# ============================================================
# CANDIDATURE
# ============================================================

class CandidatureMissionSerializer(
    serializers.ModelSerializer
):

    mission = MissionSerializer(
        read_only=True
    )

    freelance_nom = serializers.SerializerMethodField()

    class Meta:

        model = CandidatureMission

        fields = [

            "id",

            "mission",

            "freelance",
            "freelance_nom",

            "proposition",

            "montantPropose",
            "devise",

            "delaiPropose",

            "statut",

            "dateCandidature",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "freelance",
            "freelance_nom",
            "statut",
            "dateCandidature",
            "updated_at",
        ]

    def get_freelance_nom(self, obj):

        nom = (
            f"{obj.freelance.user.first_name} "
            f"{obj.freelance.user.last_name}"
        ).strip()

        if nom:
            return nom

        return obj.freelance.user.username

    # ============================================================
# CHANGEMENT DE STATUT
# ============================================================

class CandidatureMissionStatutSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = CandidatureMission

        fields = [
            "statut"
        ]

    def validate_statut(self, value):

        statuts_autorises = [
            "envoyee",
            "en_examen",
            "acceptee",
            "refusee",
            "retiree"
        ]

        if value not in statuts_autorises:

            raise serializers.ValidationError(
                "Statut invalide."
            )

        return value