from  app_candidatures.models import Candidature
from app_users.models import User

# Create your models here.
from django.db import models

class Entretien(models.Model):
    dateHeure = models.DateTimeField()
    type = models.CharField(max_length=50)  # Visio, Presentiel, Telephonique
    lieu = models.CharField(max_length=200, blank=True, null=True)
    statut = models.CharField(max_length=50, default='Planifié')
    
    recruteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entretiens_animes')
    candidature = models.ForeignKey(
    Candidature,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Entretien {self.type} le {self.dateHeure}"


# Create your models here.