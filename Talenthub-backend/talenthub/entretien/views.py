from django.shortcuts import render
from rest_framework import viewsets

from .models import Entretien
from .serializers import EntretienSerializer


class EntretienViewSet(viewsets.ModelViewSet):
    queryset = Entretien.objects.all()
    serializer_class = EntretienSerializer
# Create your views here.
