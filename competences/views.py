

from rest_framework import viewsets
from .models import Competence
from .serializers import CompetenceSerializer

class CompetenceViewSet(viewsets.ModelViewSet):
    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer
