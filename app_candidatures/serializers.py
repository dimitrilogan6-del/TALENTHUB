from rest_framework import serializers#me donne acces aux outils necessaire pour transformer mes donnnes en format JSON
from .models import Candidature
class CandidatureSerializer(serializers.ModelSerializer):# Étape 3 : On crée la classe qui va traduire nos données Python en texte JSON
    class Meta:#On ouvre la configuration interne du traducteur
        model = Candidature#On dit au traducteur de travailler sur ton modèle Candidature
        fields = '__all__'#On lui demande d'inclure absolument toutes les colonnes dans l'API