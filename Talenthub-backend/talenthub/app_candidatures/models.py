from django.db import models
from django.contrib.auth.models import User
from offres.models import Offre

class Candidature(models.Model):
    dateSoumission = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50, default='En attente')
    dateModification = models.DateTimeField(auto_now=True)
    
    # Relations
    candidat = models.ForeignKey(User, on_delete=models.CASCADE, related_name='candidatures')
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='candidatures')
    class Meta:
        # Cette contrainte empêche un même candidat de postuler plusieurs fois à la même offre
        constraints = [
            models.UniqueConstraint(
                fields=['candidat', 'offre'],
                name='unique_candidature_par_offre'
            )
        ]

    
    def __str__(self):
        return f"Candidature de {self.candidat.username} pour {self.offre.titre}"