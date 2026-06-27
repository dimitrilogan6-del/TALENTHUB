from rest_framework import serializers#me donne acces aux outils necessaire pour transformer mes donnnes en format JSON
from .models import Candidature
class CandidatureSerializer(serializers.ModelSerializer):# Étape 3 : On crée la classe qui va traduire nos données Python en texte JSON
    class Meta:#On ouvre la configuration interne du traducteur
        model = Candidature#On dit au traducteur de travailler sur ton modèle Candidature
        fields = '__all__'#On lui demande d'inclure absolument toutes les colonnes dans l'API
    def validate(self,data) :
        #On extrait l'dentification du candidadt et de l'offre 
         candidat_id = data.get('candidat_id')  
         offre_id = data.get('offre_id')
         #on interroge la base de donnee  s'il existe deja ce candidat avec cet offre
         deja_postule = Candidature.objects.filter(candidat_id=candidat_id, offre_id=offre_id).exists()

         if deja_postule:
             #fais des recherches dans la base de donnees 
             
             raise serializers.ValidationError(
             {"erreur":"vous avez deja soumis une candidature pour cette offre"})
             return data