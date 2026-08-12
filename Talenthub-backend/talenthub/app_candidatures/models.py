from django.db import models
from django.contrib.auth.models import User
from offres.models import Offre


class Candidature(models.Model):

    STATUT_CHOICES = [
        ('En attente', 'En attente'),
        ('Présélectionnée', 'Présélectionnée'),
        ('Entretien', 'Entretien'),
        ('Acceptée', 'Acceptée'),
        ('Refusée', 'Refusée'),
        ('Retirée', 'Retirée'),
    ]

    # ==========================================================
    # INFORMATIONS PRINCIPALES
    # ==========================================================

    candidat = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='candidatures'
    )

    offre = models.ForeignKey(
        Offre,
        on_delete=models.CASCADE,
        related_name='candidatures'
    )

    dateSoumission = models.DateTimeField(
        auto_now_add=True
    )

    dateModification = models.DateTimeField(
        auto_now=True
    )

    nombre_modifications = models.PositiveIntegerField(
        default=0
    )

    statut = models.CharField(
        max_length=50,
        choices=STATUT_CHOICES,
        default='En attente'
    )

    lettreMotivation = models.TextField(
        blank=True,
        null=True
    )

    # ==========================================================
    # DECISION DU RECRUTEUR
    # ==========================================================

    commentaireRecruteur = models.TextField(
        blank=True,
        null=True
    )

    dateDecision = models.DateTimeField(
        blank=True,
        null=True
    )

    # ==========================================================
    # META
    # ==========================================================

    class Meta:

        ordering = ['-dateSoumission']

        constraints = [
            models.UniqueConstraint(
                fields=['candidat', 'offre'],
                name='unique_candidature_par_offre'
            )
        ]

    def __str__(self):

        return (
            f"Candidature de "
            f"{self.candidat.username} "
            f"pour {self.offre.titre}"
        )


# ==============================================================
# DOCUMENTS DE CANDIDATURE
# ==============================================================

class Document(models.Model):

    TYPE_CHOICES = [
        ('CV', 'CV'),
        ('Lettre', 'Lettre de motivation'),
        ('Diplome', 'Diplôme'),
        ('Certificat', 'Certificat'),
        ('Portfolio', 'Portfolio'),
        ('Autre', 'Autre'),
    ]

    candidature = models.ForeignKey(
        Candidature,
        on_delete=models.CASCADE,
        related_name='documents'
    )

    nomFichier = models.CharField(
        max_length=200
    )

    typeFichier = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='Autre'
    )

    contenu = models.FileField(
        upload_to='candidatures/%Y/%m/%d/'
    )

    taille = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.nomFichier


# ==============================================================
# ENTRETIENS
# ==============================================================

class Entretien(models.Model):

    TYPE_CHOICES = [
        ('Visio', 'Visio'),
        ('Présentiel', 'Présentiel'),
        ('Téléphonique', 'Téléphonique'),
    ]

    STATUT_CHOICES = [
        ('Planifié', 'Planifié'),
        ('Confirmé', 'Confirmé'),
        ('Terminé', 'Terminé'),
        ('Annulé', 'Annulé'),
        ('Reporté', 'Reporté'),
    ]

    REPONSE_CANDIDAT_CHOICES = [
        ('En attente', 'En attente'),
        ('Confirmé', 'Confirmé'),
        ('Refusé', 'Refusé'),
    ]

    # ==========================================================
    # RELATIONS
    # ==========================================================

    candidature = models.ForeignKey(
        Candidature,
        on_delete=models.CASCADE,
        related_name='entretiens'
    )

    recruteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='entretiens_animes'
    )

    # ==========================================================
    # PLANIFICATION
    # ==========================================================

    dateHeure = models.DateTimeField()

    type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES
    )

    # Pour un entretien présentiel
    lieu = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # Pour un entretien en ligne
    lienVisio = models.URLField(
        blank=True,
        null=True
    )

    # ==========================================================
    # STATUT
    # ==========================================================

    statut = models.CharField(
        max_length=50,
        choices=STATUT_CHOICES,
        default='Planifié'
    )

    reponseCandidat = models.CharField(
        max_length=50,
        choices=REPONSE_CANDIDAT_CHOICES,
        default='En attente'
    )

    # ==========================================================
    # INFORMATIONS COMPLEMENTAIRES
    # ==========================================================

    commentaire = models.TextField(
        blank=True,
        null=True
    )

    motifAnnulation = models.TextField(
        blank=True,
        null=True
    )

    # ==========================================================
    # DATES
    # ==========================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = ['dateHeure']

    def __str__(self):

        return (
            f"Entretien - "
            f"{self.candidature.candidat.username} - "
            f"{self.candidature.offre.titre}"
        )