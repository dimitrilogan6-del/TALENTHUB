from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.http import JsonResponse




from .models import Document
import json



class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
