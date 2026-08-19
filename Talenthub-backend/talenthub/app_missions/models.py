from django.db import models
from django.contrib.auth.models import User

from app_users.models import Entreprise, Profil


# ============================================================
# MISSION
# ============================================================

class Mission(models.Model):

    TYPE_MISSION_CHOICES = (
        ("ponctuelle", "Mission ponctuelle"),
        ("projet", "Projet"),
        ("longue_duree", "Longue durée"),
        ("temps_partiel", "Temps partiel"),
        ("temps_plein", "Temps plein"),
    )

    STATUT_CHOICES = (
        ("brouillon", "Brouillon"),
        ("publiee", "Publiée"),
        ("en_cours", "En cours"),
        ("terminee", "Terminée"),
        ("annulee", "Annulée"),
        ("fermee", "Fermée"),
    )

    MODE_TRAVAIL_CHOICES = (
        ("sur_place", "Sur place"),
        ("hybride", "Hybride"),
        ("distance", "À distance"),
    )

    # ========================================================
    # INFORMATIONS PRINCIPALES
    # ========================================================

    titre = models.CharField(
        max_length=200
    )

    description = models.TextField()

    typeMission = models.CharField(
        max_length=50,
        choices=TYPE_MISSION_CHOICES,
        default="projet"
    )

    domaine = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    localisation = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    modeTravail = models.CharField(
        max_length=30,
        choices=MODE_TRAVAIL_CHOICES,
        default="distance"
    )

    # ========================================================
    # BUDGET
    # ========================================================

    budgetMin = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    budgetMax = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    deviseBudget = models.CharField(
        max_length=10,
        default="FCFA"
    )

    # ========================================================
    # DATES
    # ========================================================

    datePublication = models.DateTimeField(
        auto_now_add=True
    )

    dateLimite = models.DateField(
        blank=True,
        null=True
    )

    dateDebut = models.DateField(
        blank=True,
        null=True
    )

    dateFinPrevue = models.DateField(
        blank=True,
        null=True
    )

    # ========================================================
    # STATUT
    # ========================================================

    statut = models.CharField(
        max_length=30,
        choices=STATUT_CHOICES,
        default="brouillon"
    )

    # ========================================================
    # RELATIONS
    # ========================================================

    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name="missions"
    )

    recruteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="missions_publiees"
    )

    # ========================================================
    # FREELANCE RETENU
    # ========================================================

    freelance = models.ForeignKey(
        Profil,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="missions"
    )

    # ========================================================
    # INFORMATIONS SUPPLÉMENTAIRES
    # ========================================================

    nombreCandidats = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # ========================================================
    # MÉTHODES
    # ========================================================

    def __str__(self):

        return (
            f"{self.titre} - "
            f"{self.entreprise.nom}"
        )

    @property
    def est_active(self):

        return self.statut == "publiee"


# ============================================================
# COMPETENCE MISSION
# ============================================================

class CompetenceMission(models.Model):

    NIVEAU_CHOICES = (
        ("debutant", "Débutant"),
        ("intermediaire", "Intermédiaire"),
        ("avance", "Avancé"),
        ("expert", "Expert"),
    )

    mission = models.ForeignKey(
        Mission,
        on_delete=models.CASCADE,
        related_name="competences"
    )

    nom = models.CharField(
        max_length=100
    )

    niveauRequis = models.CharField(
        max_length=30,
        choices=NIVEAU_CHOICES,
        default="intermediaire"
    )

    estObligatoire = models.BooleanField(
        default=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "mission",
                    "nom"
                ],
                name="unique_competence_mission"
            )
        ]

    def __str__(self):

        return (
            f"{self.mission.titre} - "
            f"{self.nom}"
        )


# ============================================================
# CANDIDATURE À UNE MISSION
# ============================================================

class CandidatureMission(models.Model):

    STATUT_CHOICES = (
        ("envoyee", "Envoyée"),
        ("en_examen", "En examen"),
        ("acceptee", "Acceptée"),
        ("refusee", "Refusée"),
        ("retiree", "Retirée"),
    )

    mission = models.ForeignKey(
        Mission,
        on_delete=models.CASCADE,
        related_name="candidatures"
    )

    freelance = models.ForeignKey(
        Profil,
        on_delete=models.CASCADE,
        related_name="candidatures_missions"
    )

    proposition = models.TextField(
        blank=True,
        null=True
    )

    montantPropose = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    devise = models.CharField(
        max_length=10,
        default="FCFA"
    )

    delaiPropose = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Durée proposée en jours"
    )

    statut = models.CharField(
        max_length=30,
        choices=STATUT_CHOICES,
        default="envoyee"
    )

    dateCandidature = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "mission",
                    "freelance"
                ],
                name="unique_candidature_mission_freelance"
            )
        ]

    def __str__(self):

        return (
            f"{self.freelance.user.username} "
            f"- {self.mission.titre}"
        )