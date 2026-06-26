from rest_framework import viewsets#On importe l'outil ViewSet qui gère automatiquement le CRUD (Créer, Lire, Modifier, Supprimer)
from .models import Candidature 
from .serializers import CandidatureSerializer   #On importe ton traducteur pour convertir les données lues en JSON
class CandidatureViewSet(viewsets.ModelViewSet):# On crée le contrôleur de l'API pour les candidatures
    queryset = Candidature.objects.all()#On indique à Django où aller chercher toutes les lignes de données dans la base
#On indique à la vue quel traducteur utiliser pour envoyer le JSON
    serializer_class = CandidatureSerializer    