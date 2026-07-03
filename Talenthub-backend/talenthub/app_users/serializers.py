from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profil

# Pour la lecture (GET)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfilSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profil
        fields = '__all__'

# Pour la création (POST) 
class InscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Profil
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'role', 'telephone', 'numCni', 'dateNaissance', 'lieuNaissance', 'sexe',
            'niveauEtude', 'nationalite', 'specialite', 'statut', 'dernierDiplome', 
            'dateObtentionDiplome', 'numPassport', 'dateEmbauche'
        ]

    def create(self, validated_data):
        # On retire les champs qui appartiennent à User
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')

        # On crée l'utilisateur
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # On crée le profil avec le reste des données
        profil = Profil.objects.create(user=user, **validated_data)
        return profil