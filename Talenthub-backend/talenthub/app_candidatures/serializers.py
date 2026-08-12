from rest_framework import serializers
from django.contrib.auth.models import User

from .models import (
    Candidature,
    Document,
    Entretien
)


# ==============================================================
# UTILISATEUR
# ==============================================================

class UserResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email'
        ]


# ==============================================================
# DOCUMENT
# ==============================================================

class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document

        fields = [
            'id',
            'nomFichier',
            'typeFichier',
            'contenu',
            'taille',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'taille',
            'created_at'
        ]

    def create(self, validated_data):

        fichier = validated_data.get('contenu')

        if fichier:
            validated_data['taille'] = fichier.size
            validated_data['nomFichier'] = fichier.name

        return super().create(validated_data)


# ==============================================================
# ENTRETIEN
# ==============================================================

class EntretienSerializer(serializers.ModelSerializer):

    recruteur = UserResumeSerializer(
        read_only=True
    )

    candidat = serializers.SerializerMethodField()

    offre = serializers.SerializerMethodField()

    class Meta:

        model = Entretien

        fields = [
            'id',
            'candidature',
            'recruteur',
            'candidat',
            'offre',
            'dateHeure',
            'type',
            'lieu',
            'lienVisio',
            'statut',
            'reponseCandidat',
            'commentaire',
            'motifAnnulation',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'recruteur',
            'candidat',
            'offre',
            'created_at',
            'updated_at'
        ]

    def get_candidat(self, obj):

        return UserResumeSerializer(
            obj.candidature.candidat
        ).data

    def get_offre(self, obj):

        return {
            'id': obj.candidature.offre.id,
            'titre': obj.candidature.offre.titre
        }

    def validate(self, attrs):

        type_entretien = attrs.get(
            'type',
            getattr(self.instance, 'type', None)
        )

        lieu = attrs.get(
            'lieu',
            getattr(self.instance, 'lieu', None)
        )

        lien_visio = attrs.get(
            'lienVisio',
            getattr(self.instance, 'lienVisio', None)
        )

        # Présentiel → lieu obligatoire
        if type_entretien == 'Présentiel' and not lieu:

            raise serializers.ValidationError({
                'lieu':
                    'Le lieu est obligatoire pour un entretien présentiel.'
            })

        # Visio → lien obligatoire
        if type_entretien == 'Visio' and not lien_visio:

            raise serializers.ValidationError({
                'lienVisio':
                    'Le lien de visioconférence est obligatoire.'
            })

        # Téléphonique → pas besoin de lieu
        return attrs


# ==============================================================
# CANDIDATURE
# ==============================================================

class CandidatureSerializer(serializers.ModelSerializer):

    candidat = UserResumeSerializer(
        read_only=True
    )

    documents = DocumentSerializer(
        many=True,
        read_only=True
    )

    entretiens = EntretienSerializer(
        many=True,
        read_only=True
    )

    offre_detail = serializers.SerializerMethodField()

    class Meta:

        model = Candidature

        fields = [
            'id',
            'candidat',
            'offre',
            'offre_detail',
            'dateSoumission',
            'dateModification',
            'nombre_modifications',
            'statut',
            'lettreMotivation',
            'commentaireRecruteur',
            'dateDecision',
            'documents',
            'entretiens'
        ]

        read_only_fields = [
            'id',
            'candidat',
            'dateSoumission',
            'dateModification',
            'nombre_modifications',
            'statut',
            'commentaireRecruteur',
            'dateDecision',
            'documents',
            'entretiens'
        ]

    def get_offre_detail(self, obj):

        offre = obj.offre

        return {
            'id': offre.id,
            'titre': offre.titre,
            'entreprise': offre.entreprise.nom
        }

    def validate(self, attrs):

        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                'Vous devez être connecté pour postuler.'
            )

        user = request.user

        # Seul un candidat peut postuler
        try:
            profil = user.profil
        except Exception:
            raise serializers.ValidationError(
                'Votre profil est introuvable.'
            )

        if profil.role != 'candidat':
            raise serializers.ValidationError(
                'Seuls les candidats peuvent postuler à une offre.'
            )

        offre = attrs.get('offre')

        if not offre:
            raise serializers.ValidationError({
                'offre': 'L’offre est obligatoire.'
            })

        # Vérification de la date limite
        from django.utils import timezone

        if offre.dateLimite < timezone.localdate():

            raise serializers.ValidationError({
                'offre':
                    'Cette offre n’accepte plus de candidatures.'
            })

        # Une seule candidature
        if Candidature.objects.filter(
            candidat=user,
            offre=offre
        ).exists():

            raise serializers.ValidationError({
                'candidat':
                    'Vous avez déjà postulé à cette offre.'
            })

        return attrs


# ==============================================================
# CHANGEMENT DE STATUT
# ==============================================================

class CandidatureStatutSerializer(serializers.ModelSerializer):

    class Meta:

        model = Candidature

        fields = [
            'statut',
            'commentaireRecruteur'
        ]

    def validate_statut(self, value):

        statuts_autorises = [
            'En attente',
            'Présélectionnée',
            'Entretien',
            'Acceptée',
            'Refusée',
            'Retirée'
        ]

        if value not in statuts_autorises:

            raise serializers.ValidationError(
                'Statut de candidature invalide.'
            )

        return value