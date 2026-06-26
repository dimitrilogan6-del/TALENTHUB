from django.contrib import admin# Active l'outil d'administration de Django pour générer automatiquement la page web de gestion (la page bleue).
from .models import Candidature # Importe la classe 'Candidature' depuis votre fichier models.py pour que l'administration connaisse sa structure.
admin.site.register(Candidature)# Inscrit (register) votre table sur le site d'administration. C'est cette ligne qui fait apparaître le bouton "Candidatures" à l'écran.

