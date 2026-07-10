from django.db import models
from django.contrib.auth.models import User 
class Competence(models.Model):
    nom = models.CharField(max_length=100)
    niveau = models.CharField(max_length=50, blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom


# Classe d'association (NiveauCompetenceOffre )
class NiveauCompetenceOffre(models.Model):
    niveauRequis = models.CharField(max_length=50)
    estObligatoire = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.competence.nom} ({self.niveauRequis})"