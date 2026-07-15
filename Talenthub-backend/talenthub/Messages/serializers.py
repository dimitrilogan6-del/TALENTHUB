from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.http import JsonResponse




from .models import Messages
import json



class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = '__all__'