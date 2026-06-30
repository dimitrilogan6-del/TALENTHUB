from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Profil
from .serializers import ProfilSerializer

# ============================================================
# 1. ViewSet pour l'inscription (Création d'un User + Profil)
# ============================================================
class InscriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer l'inscription.
    - GET /api/inscription/ -> Liste tous les profils (visible par tout le monde en développement)
    - POST /api/inscription/ -> Crée un nouvel utilisateur et son profil
    """
    queryset = Profil.objects.all()
    serializer_class = ProfilSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        
        # 1. Validation des champs obligatoires
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return Response(
                {"error": "Les champs username, email et password sont obligatoires"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Création de l'utilisateur Django
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )

        # 3. Création du profil associé
        profil = Profil.objects.create(
            user=user,
            role=data.get('role', 'candidat'),
            telephone=data.get('telephone', ''),
            numCni=data.get('numCni', ''),
            dateNaissance=data.get('dateNaissance', None),
            lieuNaissance=data.get('lieuNaissance', ''),
            sexe=data.get('sexe', ''),
            niveauEtude=data.get('niveauEtude', ''),
            nationalite=data.get('nationalite', ''),
            specialite=data.get('specialite', ''),
            statut=data.get('statut', 'Actif')
        )

        return Response(ProfilSerializer(profil).data, status=status.HTTP_201_CREATED)


# ============================================================
# 2. ViewSet pour le profil de l'utilisateur connecté
# ============================================================
class MonProfilViewSet(viewsets.ModelViewSet):
    serializer_class = ProfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtre pour ne renvoyer que le profil de l'utilisateur actuellement connecté
        return Profil.objects.filter(user=self.request.user)

    def get_object(self):
        # Retourne directement le profil de l'utilisateur connecté sans passer par un ID
        return self.request.user.profil