from django.contrib.auth.models import User

from rest_framework import serializers

from .models import (
    Entreprise,
    Profil,
    RecruteurEntreprise,
    Message,
    Notification,
)


# ============================================================
# USER
# ============================================================

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
        ]

        read_only_fields = [
            "id"
        ]


# ============================================================
# FREELANCE
# ============================================================

class FreelanceSerializer(serializers.ModelSerializer):

    user = UserSerializer(
        read_only=True
    )

    nom_complet = serializers.SerializerMethodField()

    profile_completion = serializers.ReadOnlyField()

    photo = serializers.SerializerMethodField()

    class Meta:

        model = Profil

        fields = [

            "id",

            "user",

            "nom_complet",

            "role",

            "titreProfessionnel",

            "specialite",

            "biographie",

            "anneesExperience",

            "tarifHoraire",

            "deviseTarif",

            "disponibilite",

            "photoProfil",

            "photo",

            "portfolioUrl",

            "linkedinUrl",

            "githubUrl",

            "niveauEtude",

            "dernierDiplome",

            "nationalite",

            "telephone",

            "profile_completion",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "nom_complet",
            "photo",
            "profile_completion",
            "created_at",
            "updated_at",
        ]

    def get_nom_complet(self, obj):

        nom = (
            f"{obj.user.first_name} "
            f"{obj.user.last_name}"
        ).strip()

        if nom:
            return nom

        return obj.user.username

    def get_photo(self, obj):

        if not obj.photoProfil:
            return None

        request = self.context.get(
            "request"
        )

        if request:
            return request.build_absolute_uri(
                obj.photoProfil.url
            )

        return obj.photoProfil.url
# ============================================================
# ENTREPRISE - VERSION SIMPLE
# ============================================================

class EntrepriseSimpleSerializer(serializers.ModelSerializer):
    """
    Version légère utilisée lorsqu'une entreprise est affichée
    à l'intérieur du profil d'un recruteur.
    """

    class Meta:
        model = Entreprise
        fields = [
            "id",
            "nom",
            "secteur",
            "statut",
            "verifiee",
            "logo",
        ]
        read_only_fields = ["id", "statut", "verifiee"]


# ============================================================
# ENTREPRISE - VERSION COMPLETE
# ============================================================

class EntrepriseSerializer(serializers.ModelSerializer):
    """
    Sérialiseur complet d'une entreprise.

    Une entreprise peut avoir plusieurs recruteurs.
    """

    nombre_recruteurs = serializers.SerializerMethodField()

    class Meta:
        model = Entreprise
        fields = [
            "id",
            "nom",
            "secteur",
            "adresse",
            "telephone",
            "email",
            "siteweb",
            "description",
            "logo",
            "statut",
            "verifiee",
            "nombre_recruteurs",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "statut",
            "verifiee",
            "nombre_recruteurs",
            "created_at",
            "updated_at",
        ]

    def get_nombre_recruteurs(self, obj):
        """
        Compte les recruteurs actifs associés à l'entreprise.

        IMPORTANT :
        obj est une Entreprise.
        On utilise donc associations_recruteurs,
        défini dans RecruteurEntreprise.
        """

        return obj.associations_recruteurs.filter(
            actif=True
        ).count()


# ============================================================
# RECRUTEUR -> ENTREPRISE
# ============================================================

class RecruteurEntrepriseSerializer(serializers.ModelSerializer):
    """
    Représente l'association entre un recruteur et une entreprise.
    """

    entreprise = EntrepriseSimpleSerializer(read_only=True)

    entreprise_id = serializers.PrimaryKeyRelatedField(
        queryset=Entreprise.objects.all(),
        source="entreprise",
        write_only=True,
        required=False,
    )

    class Meta:
        model = RecruteurEntreprise
        fields = [
            "id",
            "entreprise",
            "entreprise_id",
            "fonction",
            "principal",
            "actif",
            "dateAssociation",
        ]

        read_only_fields = [
            "id",
            "dateAssociation",
        ]


# ============================================================
# PROFIL
# ============================================================
class ProfilSerializer(serializers.ModelSerializer):
    
    user = UserSerializer(read_only=True)

    entreprises = EntrepriseSimpleSerializer(
        many=True,
        read_only=True
    )

    associations_entreprises = RecruteurEntrepriseSerializer(
        many=True,
        read_only=True
    )

    nombre_entreprises = serializers.SerializerMethodField()

    nom_complet = serializers.SerializerMethodField()

    est_admin = serializers.SerializerMethodField()

    profile_completion = serializers.ReadOnlyField()

    class Meta:
        model = Profil

        fields = [

            # IDENTIFICATION
            "id",
            "user",
            "role",

            # INFORMATIONS PERSONNELLES
            "numCni",
            "dateNaissance",
            "lieuNaissance",
            "telephone",
            "numPassport",
            "sexe",
            "nationalite",

            # CANDIDAT
            "niveauEtude",
            "dernierDiplome",
            "dateObtentionDiplome",
            "specialite",

            # RECRUTEUR
            "dateEmbauche",
            "fonction",
            "statut_recruteur",

            "entreprises",
            "associations_entreprises",
            "nombre_entreprises",

            # FREELANCE
            "titreProfessionnel",
            "biographie",
            "anneesExperience",
            "tarifHoraire",
            "deviseTarif",
            "disponibilite",
            "portfolioUrl",
            "linkedinUrl",
            "githubUrl",

            # COMPTE
            "statut_compte",
            "photoProfil",

            # CHAMPS CALCULÉS
            "nom_complet",
            "est_admin",
            "profile_completion",

            # DATES
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "entreprises",
            "associations_entreprises",
            "nombre_entreprises",
            "nom_complet",
            "est_admin",
            "profile_completion",
            "created_at",
            "updated_at",
        ]

    # =====================================
    # NOMBRE D'ENTREPRISES
    # =====================================

    def get_nombre_entreprises(self, obj):

        if obj.role != "recruteur":
            return 0

        return obj.associations_entreprises.filter(
            actif=True
        ).count()

    # =====================================
    # NOM COMPLET
    # =====================================

    def get_nom_complet(self, obj):

        nom = (
            f"{obj.user.first_name} "
            f"{obj.user.last_name}"
        ).strip()

        if nom:
            return nom

        return obj.user.username

    # =====================================
    # ADMIN
    # =====================================

    def get_est_admin(self, obj):

        return (
            obj.user.is_staff
            or obj.user.is_superuser
        )
# ============================================================
# INSCRIPTION
# ============================================================

class InscriptionSerializer(serializers.ModelSerializer):
    """
    Création d'un compte utilisateur + profil.

    Le frontend envoie les informations de User et Profil
    dans une seule requête.
    """

    username = serializers.CharField(
        write_only=True
    )

    email = serializers.EmailField(
        write_only=True
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    first_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    last_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = Profil

        fields = [
            # =========================
            # USER
            # =========================
            "username",
            "email",
            "password",
            "first_name",
            "last_name",

            # =========================
            # PROFIL
            # =========================
            "role",

            "telephone",
            "numCni",
            "dateNaissance",
            "lieuNaissance",
            "sexe",
            "numPassport",
            "nationalite",

            # =========================
            # CANDIDAT
            # =========================
            "niveauEtude",
            "dernierDiplome",
            "dateObtentionDiplome",
            "specialite",

            # =========================
            # RECRUTEUR
            # =========================
            "dateEmbauche",
            "fonction",

            # =========================
            # FREELANCE
            # =========================
            "titreProfessionnel",
            "biographie",
            "anneesExperience",
            "tarifHoraire",
            "deviseTarif",
            "disponibilite",
            "portfolioUrl",
            "linkedinUrl",
            "githubUrl",
        ]

    # ========================================================
    # VALIDATION USERNAME
    # ========================================================

    def validate_username(self, value):

        if User.objects.filter(
            username=value
        ).exists():

            raise serializers.ValidationError(
                "Ce nom d'utilisateur est déjà utilisé."
            )

        return value

    # ========================================================
    # VALIDATION EMAIL
    # ========================================================

    def validate_email(self, value):

        if User.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "Cette adresse email est déjà utilisée."
            )

        return value

    # ========================================================
    # VALIDATION ROLE
    # ========================================================

    def validate_role(self, value):

        roles_autorises = [
            "candidat",
            "recruteur",
            "freelance",
        ]

        if value not in roles_autorises:

            raise serializers.ValidationError(
                "Rôle utilisateur invalide."
            )

        return value

    # ========================================================
    # CREATION
    # ========================================================

    def create(self, validated_data):

        # ----------------------------------------------
        # USER
        # ----------------------------------------------

        username = validated_data.pop(
            "username"
        )

        email = validated_data.pop(
            "email"
        )

        password = validated_data.pop(
            "password"
        )

        first_name = validated_data.pop(
            "first_name",
            ""
        )

        last_name = validated_data.pop(
            "last_name",
            ""
        )

        # ----------------------------------------------
        # CREATION USER
        # ----------------------------------------------

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # ----------------------------------------------
        # CREATION PROFIL
        # ----------------------------------------------

        profil = Profil.objects.create(
            user=user,
            **validated_data
        )

        return profil


# ============================================================
# MESSAGE
# ============================================================

class MessageSerializer(serializers.ModelSerializer):
    """
    Sérialiseur de messagerie.
    """

    expediteur = UserSerializer(
        read_only=True
    )

    destinataire = UserSerializer(
        read_only=True
    )

    destinataire_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="destinataire",
        write_only=True,
        required=True
    )

    class Meta:
        model = Message

        fields = [
            "id",
            "contenu",
            "dateEnvoi",
            "lu",
            "expediteur",
            "destinataire",
            "destinataire_id",
        ]

        read_only_fields = [
            "id",
            "dateEnvoi",
            "expediteur",
            "destinataire",
        ]


# ============================================================
# NOTIFICATION
# ============================================================

class NotificationSerializer(serializers.ModelSerializer):
    """
    Sérialiseur des notifications.
    """

    destinataire = UserSerializer(
        read_only=True
    )

    class Meta:
        model = Notification

        fields = [
            "id",
            "contenu",
            "dateEnvoi",
            "lu",
            "destinataire",
        ]

        read_only_fields = [
            "id",
            "dateEnvoi",
            "destinataire",
        ]
