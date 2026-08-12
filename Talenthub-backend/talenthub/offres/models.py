from django.db import models
from django.contrib.auth.models import User

from app_users.models import Entreprise


class Competence(models.Model):

    nom = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.nom


class Offre(models.Model):

    TYPE_OFFRE_CHOICES = (
        ("CDI", "CDI"),
        ("CDD", "CDD"),
        ("stage", "Stage"),
        ("freelance", "Freelance"),
        ("alternance", "Alternance"),
        ("interim", "Intérim"),
    )

    STATUT_CHOICES = (
        ("brouillon", "Brouillon"),
        ("en_attente", "En attente"),
        ("publiee", "Publiée"),
        ("suspendue", "Suspendue"),
        ("expiree", "Expirée"),
        ("fermee", "Fermée"),
    )

    titre = models.CharField(
        max_length=200
    )

    description = models.TextField()

    typeOffre = models.CharField(
        max_length=50,
        choices=TYPE_OFFRE_CHOICES
    )

    localisation = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    salaireMin = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    salaireMax = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    deviseSalaire = models.CharField(
        max_length=10,
        default="FCFA"
    )

    datePublication = models.DateTimeField(
        auto_now_add=True
    )

    dateLimite = models.DateField()

    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default="brouillon"
    )

    # ============================
    # RELATIONS
    # ============================

    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name="offres"
    )

    recruteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="offres_publiees"
    )

    competences = models.ManyToManyField(
        Competence,
        through="NiveauCompetenceOffre",
        related_name="offres"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.titre} - {self.entreprise.nom}"


class NiveauCompetenceOffre(models.Model):

    NIVEAU_CHOICES = (
        ("debutant", "Débutant"),
        ("intermediaire", "Intermédiaire"),
        ("avance", "Avancé"),
        ("expert", "Expert"),
    )

    offre = models.ForeignKey(
        Offre,
        on_delete=models.CASCADE,
        related_name="niveaux_competences"
    )

    competence = models.ForeignKey(
        Competence,
        on_delete=models.CASCADE,
        related_name="niveaux_offres"
    )

    niveauRequis = models.CharField(
        max_length=50,
        choices=NIVEAU_CHOICES
    )

    estObligatoire = models.BooleanField(
        default=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["offre", "competence"],
                name="unique_competence_offre"
            )
        ]

    def __str__(self):
        return (
            f"{self.offre.titre} - "
            f"{self.competence.nom} - "
            f"{self.niveauRequis}"
        )
