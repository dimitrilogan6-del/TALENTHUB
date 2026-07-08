from django.db import models
from django.utils import timezone


class Candidature(models.Model):
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Candidature {self.id}"


class Document(models.Model):
    # candidature = models.ForeignKey(
    #     Candidature,
    #     on_delete=models.CASCADE,
    #     related_name="documents"
    # )

    nom_fichier = models.CharField(max_length=255)
    type_fichier = models.CharField(max_length=100)
    chemin = models.FileField(upload_to="documents/")
    taille = models.IntegerField()

    def __str__(self):
        return self.nom_fichier