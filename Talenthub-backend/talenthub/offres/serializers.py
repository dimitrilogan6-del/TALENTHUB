from rest_framework import serializers
from .models import Entreprise, Offre, Competence, NiveauCompetenceOffre

class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = '__all__'

class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = '__all__'

class OffreSerializer(serializers.ModelSerializer):
    entreprise = EntrepriseSerializer(read_only=True)
    competences = serializers.SerializerMethodField()

    class Meta:
        model = Offre
        fields = '__all__'

    def get_competences(self, obj):
        # Récupère les compétences associées via la table d'association
        competences = NiveauCompetenceOffre.objects.filter(offre=obj)
        return [{
            'competence': c.competence.nom,
            'niveauRequis': c.niveauRequis,
            'estObligatoire': c.estObligatoire
        } for c in competences]


