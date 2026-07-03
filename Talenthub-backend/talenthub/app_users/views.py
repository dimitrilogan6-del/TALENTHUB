from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Profil
from .serializers import ProfilSerializer, InscriptionSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Profil
from .serializers import ProfilSerializer, InscriptionSerializer

class InscriptionViewSet(viewsets.ModelViewSet):
    queryset = Profil.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return InscriptionSerializer 
        return ProfilSerializer  

    def create(self, request, *args, **kwargs):
        # On utilise InscriptionSerializer pour valider et créer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profil = serializer.save()

        # On utilise ProfilSerializer pour renvoyer la réponse
        read_serializer = ProfilSerializer(profil)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
# ViewSet pour le profil de l'utilisateur connecté
class MonProfilViewSet(viewsets.ModelViewSet):
    serializer_class = ProfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtre pour ne renvoyer que le profil de l'utilisateur actuellement connecté
        return Profil.objects.filter(user=self.request.user)

    def get_object(self):
        # Retourne directement le profil de l'utilisateur connecté sans passer par un ID
        return self.request.user.profil