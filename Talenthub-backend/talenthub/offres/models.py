from django.db import models
from django.contrib.auth.models import User
from app_users.models import Profil

class Entreprise(models.Model):
    nom = models.CharField(max_length=200)
    secteur = models.CharField(max_length=100, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    siteweb = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom


class Offre(models.Model):
    titre = models.CharField(max_length=200)
    datePublication = models.DateTimeField(auto_now_add=True)
    dateLimite = models.DateField()
    typeOffre = models.CharField(max_length=50)  # CDI, Stage, Freelance...
    description = models.TextField()
    
    # Relations
    recruteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offres_publices')
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE, related_name='offres')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.titre} - {self.entreprise.nom}"


class Competence(models.Model):
    nom = models.CharField(max_length=100)
    niveau = models.CharField(max_length=50, blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom


# Classe d'association (NiveauCompetenceOffre )
class NiveauCompetenceOffre(models.Model):
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='niveau_competence_offre')
    competence = models.ForeignKey(Competence, on_delete=models.CASCADE)
    niveauRequis = models.CharField(max_length=50)
    estObligatoire = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.competence.nom} ({self.niveauRequis})"