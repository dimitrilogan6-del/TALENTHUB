from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import  Competence, NiveauCompetenceOffre
from .serializers import  CompetenceSerializer, NiveauCompetenceOffreSerializer


class CompetenceViewSet(viewsets.ModelViewSet):
    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class NiveauCompetenceOffreViewSet(viewsets.ModelViewSet):
    queryset = NiveauCompetenceOffre.objects.all()
    serializer_class = NiveauCompetenceOffreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
