from django.db import models
from django.contrib.auth.models import User

class Profil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profil')

    # Champs communs
    numCni = models.CharField(max_length=50, blank=True, null=True)
    dateNaissance = models.DateField(blank=True, null=True)
    lieuNaissance = models.CharField(max_length=100, blank=True, null=True)
    telephone = models.CharField(max_length=15, blank=True, null=True)
    numPassport = models.CharField(max_length=50, blank=True, null=True)
    sexe = models.CharField(max_length=10, choices=[('M', 'Masculin'), ('F', 'Féminin')], blank=True, null=True)
    
    # Le rôle (Candidat, Recruteur, Admin)
    ROLE_CHOICES = (
        ('candidat', 'Candidat'),
        ('recruteur', 'Recruteur'),
        ('admin', 'Administrateur'),
        ('freelance', 'Freelance')

    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidat')

    # Champs spécifiques Candidat
    niveauEtude = models.CharField(max_length=100, blank=True, null=True)
    dernierDiplome = models.CharField(max_length=100, blank=True, null=True)
    dateObtentionDiplome = models.DateField(blank=True, null=True)
    nationalite = models.CharField(max_length=50, blank=True, null=True)
    specialite = models.CharField(max_length=100, blank=True, null=True)
    statut = models.CharField(max_length=50, blank=True, null=True)

    # Champs spécifiques Recruteur
    dateEmbauche = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


