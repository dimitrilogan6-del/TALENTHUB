from rest_framework import serializers
from .models import Entretien


class EntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entretien
        fields = '__all__'
