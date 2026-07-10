from rest_framework import serializers
from .models import  Competence, NiveauCompetenceOffre


class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = '__all__'
class NiveauCompetenceOffreSerializer(serializers.ModelSerializer):
        class Meta:
            model = NiveauCompetenceOffre
            fields = '__all__'

   
