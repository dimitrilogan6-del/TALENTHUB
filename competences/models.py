from django.db import models

# Create your models here.
from django.db import models

class Competence(models.Model):
    NIVEAU_CHOICES = [
        ('debutant', 'Débutant'),
        ('intermediaire', 'Intermédiaire'),
        ('expert', 'Expert'),
    ]
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    niveau = models.CharField(max_length=50, choices=NIVEAU_CHOICES)
    
    def __str__(self):
        return self.nom