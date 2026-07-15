from django.shortcuts import render
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Candidature
from .serializers import CandidatureSerializer

class CandidatureViewSet(viewsets.ModelViewSet):
    queryset = Candidature.objects.all()
    serializer_class = CandidatureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Si l'utilisateur est un recruteur, il voit les candidatures de ses offres
        if self.request.user.profil.role == 'recruteur':
            return Candidature.objects.filter(offre__recruteur=self.request.user)
        # Si c'est un candidat, il voit ses propres candidatures
        return Candidature.objects.filter(candidat=self.request.user)

