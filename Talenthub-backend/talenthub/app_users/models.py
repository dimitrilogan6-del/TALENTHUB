from django.db import models
from django.contrib.auth.models import User


# ============================================================
# ENTREPRISE
# ============================================================

class Entreprise(models.Model):

    STATUT_CHOICES = (
        ("en_attente", "En attente"),
        ("active", "Active"),
        ("suspendue", "Suspendue"),
        ("refusee", "Refusée"),
    )

    nom = models.CharField(
        max_length=200,
        unique=True
    )

    secteur = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    adresse = models.TextField(
        blank=True,
        null=True
    )

    telephone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    siteweb = models.URLField(
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    logo = models.ImageField(
        upload_to="entreprises/logos/",
        blank=True,
        null=True
    )

    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default="en_attente"
    )

    verifiee = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.nom


# ============================================================
# PROFIL
# ============================================================

class Profil(models.Model):

    ROLE_CHOICES = (
        ("candidat", "Candidat"),
        ("recruteur", "Recruteur"),
        ("freelance", "Freelance"),
    )

    STATUT_COMPTE_CHOICES = (
        ("actif", "Actif"),
        ("en_attente", "En attente"),
        ("suspendu", "Suspendu"),
        ("bloque", "Bloqué"),
    )

    STATUT_RECRUTEUR_CHOICES = (
        ("non_concerne", "Non concerné"),
        ("en_attente", "En attente"),
        ("verifie", "Vérifié"),
        ("refuse", "Refusé"),
        ("suspendu", "Suspendu"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profil"
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="candidat"
    )

    # ========================================================
    # INFORMATIONS PERSONNELLES
    # ========================================================

    numCni = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        unique=True,
        db_index=True
    )

    dateNaissance = models.DateField(
        blank=True,
        null=True
    )

    lieuNaissance = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    telephone = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        unique=True,
        db_index=True
    )

    numPassport = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        unique=True,
        db_index=True
    )

    sexe = models.CharField(
        max_length=10,
        choices=[
            ("M", "Masculin"),
            ("F", "Féminin"),
        ],
        blank=True,
        null=True
    )

    nationalite = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    # ========================================================
    # CANDIDAT
    # ========================================================

    niveauEtude = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    dernierDiplome = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    dateObtentionDiplome = models.DateField(
        blank=True,
        null=True
    )

    specialite = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    # ========================================================
    # RECRUTEUR
    # ========================================================

    dateEmbauche = models.DateField(
        blank=True,
        null=True
    )

    fonction = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    statut_recruteur = models.CharField(
        max_length=20,
        choices=STATUT_RECRUTEUR_CHOICES,
        default="non_concerne"
    )

    entreprises = models.ManyToManyField(
        Entreprise,
        through="RecruteurEntreprise",
        related_name="recruteurs",
        blank=True
    )

    # ========================================================
    # FREELANCE
    # ========================================================

    titreProfessionnel = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    biographie = models.TextField(
        blank=True,
        null=True
    )

    anneesExperience = models.PositiveIntegerField(
        default=0
    )

    tarifHoraire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    deviseTarif = models.CharField(
        max_length=10,
        default="FCFA"
    )

    disponibilite = models.BooleanField(
        default=True
    )

    portfolioUrl = models.URLField(
        blank=True,
        null=True
    )

    linkedinUrl = models.URLField(
        blank=True,
        null=True
    )

    githubUrl = models.URLField(
        blank=True,
        null=True
    )

    # ========================================================
    # COMPTE
    # ========================================================

    statut_compte = models.CharField(
        max_length=20,
        choices=STATUT_COMPTE_CHOICES,
        default="actif"
    )

    photoProfil = models.ImageField(
        upload_to="profils/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    @property
    def profile_completion(self):

        fields = [
            self.telephone,
            self.dateNaissance,
            self.nationalite,
            self.specialite,
            self.niveauEtude,
            self.dernierDiplome,
            self.photoProfil,
            self.numCni,
            self.linkedinUrl,
            self.portfolioUrl
        ]

        completed = len([
            field
            for field in fields
            if field
        ])

        total = len(fields)

        if total == 0:
            return 0

        return int(
            (completed / total) * 100
        )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# ============================================================
# COMPÉTENCE DU CANDIDAT
# ============================================================

class CompetenceCandidat(models.Model):

    NIVEAU_CHOICES = (
        ("debutant", "Débutant"),
        ("intermediaire", "Intermédiaire"),
        ("avance", "Avancé"),
        ("expert", "Expert"),
    )

    candidat = models.ForeignKey(
        Profil,
        on_delete=models.CASCADE,
        related_name="competences"
    )

    nom = models.CharField(
        max_length=100
    )

    niveau = models.CharField(
        max_length=30,
        choices=NIVEAU_CHOICES,
        default="debutant"
    )

    anneesExperience = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = ["nom"]

        constraints = [
            models.UniqueConstraint(
                fields=["candidat", "nom"],
                name="unique_competence_candidat"
            )
        ]

    def __str__(self):

        return (
            f"{self.candidat.user.username} - "
            f"{self.nom} - "
            f"{self.niveau}"
        )


# ============================================================
# RECRUTEUR / ENTREPRISE
# ============================================================

class RecruteurEntreprise(models.Model):

    recruteur = models.ForeignKey(
        Profil,
        on_delete=models.CASCADE,
        related_name="associations_entreprises"
    )

    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name="associations_recruteurs"
    )

    fonction = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    principal = models.BooleanField(
        default=False
    )

    actif = models.BooleanField(
        default=True
    )

    dateAssociation = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "recruteur",
                    "entreprise"
                ],
                name="unique_recruteur_entreprise"
            )
        ]

    def __str__(self):

        return (
            f"{self.recruteur.user.username} - "
            f"{self.entreprise.nom}"
        )


# ============================================================
# MESSAGE
# ============================================================

class Message(models.Model):

    contenu = models.TextField()

    dateEnvoi = models.DateTimeField(
        auto_now_add=True
    )

    lu = models.BooleanField(
        default=False
    )

    expediteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="messages_envoyes"
    )

    destinataire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="messages_recus"
    )

    def __str__(self):

        return (
            f"De {self.expediteur.username} "
            f"à {self.destinataire.username}"
        )


# ============================================================
# NOTIFICATION
# ============================================================

class Notification(models.Model):

    contenu = models.TextField()

    dateEnvoi = models.DateTimeField(
        auto_now_add=True
    )

    lu = models.BooleanField(
        default=False
    )

    destinataire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    def __str__(self):

        return (
            f"Notification pour "
            f"{self.destinataire.username}"
        )