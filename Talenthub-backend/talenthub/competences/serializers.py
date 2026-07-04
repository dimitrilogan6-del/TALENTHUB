from rest_framework import serializers
from .models import Competence


class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = ['id', 'nom', 'description', 'niveau']
