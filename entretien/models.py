from django.db import models

class Entretien(models.Model):
    dateHeure = models.DateTimeField()
    typeE = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.typeE} - {self.dateHeure}"

