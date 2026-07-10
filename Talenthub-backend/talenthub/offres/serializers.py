from rest_framework import serializers
from django.utils import timezone
from .models import OffreEmploi, Categorie, OffreCategorie, OffreCandidature

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'description', 'icone']
        

class OffreEmploiSerializer(serializers.ModelSerializer):
    """
    Sérialiseur principal pour les offres d'emploi
    """
    # Relations
    entreprise_nom = serializers.CharField(source='entreprise.nom', read_only=True)
    recruteur_nom = serializers.CharField(source='recruteur.get_full_name', read_only=True)
    
    # Champs calculés
    est_active = serializers.BooleanField(read_only=True)
    categories = CategorieSerializer(many=True, read_only=True)
    
    # Pour la création/mise à jour
    categories_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="Liste des IDs des catégories"
    )

    class Meta:
        model = OffreEmploi
        fields = [
            'id', 'titre', 'description', 'competences_requises', 
            'competences_souhaitables',
            'ville', 'pays', 'adresse', 'est_remote',
            'type_contrat', 'type_temps', 'niveau_experience',
            'salaire_min', 'salaire_max', 'devise',
            'date_debut', 'date_fin', 'date_publication', 
            'date_limite_candidature', 'date_modification',
            'statut', 'nombre_postes', 'est_urgent', 'est_confidentiel',
            'entreprise', 'entreprise_nom', 'recruteur', 'recruteur_nom', 'responsable',
            'nombre_candidatures', 'nombre_vues', 'est_active',
            'categories', 'categories_ids'
        ]
        read_only_fields = ['date_publication', 'date_modification', 'nombre_candidatures', 
                           'nombre_vues', 'est_active']

    def validate(self, data):
        """
        Validations personnalisées
        """
        # Vérifier que la date limite est dans le futur
        if 'date_limite_candidature' in data and data['date_limite_candidature']:
            if data['date_limite_candidature'] <= timezone.now():
                raise serializers.ValidationError({
                    'date_limite_candidature': 'La date limite doit être dans le futur'
                })

        # Vérifier que salaire_min < salaire_max
        salaire_min = data.get('salaire_min')
        salaire_max = data.get('salaire_max')
        if salaire_min and salaire_max and salaire_min > salaire_max:
            raise serializers.ValidationError({
                'salaire_min': 'Le salaire minimum doit être inférieur au salaire maximum'
            })

        return data

    def create(self, validated_data):
        categories_ids = validated_data.pop('categories_ids', [])
        offre = OffreEmploi.objects.create(**validated_data)
        
        # Ajouter les catégories
        for cat_id in categories_ids:
            try:
                categorie = Categorie.objects.get(id=cat_id)
                OffreCategorie.objects.create(offre=offre, categorie=categorie)
            except Categorie.DoesNotExist:
                pass
        
        return offre

    def update(self, instance, validated_data):
        categories_ids = validated_data.pop('categories_ids', None)
        
        # Mettre à jour les champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Mettre à jour les catégories si fournies
        if categories_ids is not None:
            # Supprimer les anciennes catégories
            OffreCategorie.objects.filter(offre=instance).delete()
            
            # Ajouter les nouvelles catégories
            for cat_id in categories_ids:
                try:
                    categorie = Categorie.objects.get(id=cat_id)
                    OffreCategorie.objects.create(offre=instance, categorie=categorie)
                except Categorie.DoesNotExist:
                    pass
        
        return instance


class OffreEmploiDetailSerializer(OffreEmploiSerializer):
    """
    Sérialiseur détaillé avec plus d'informations
    """
    candidatures = OffreCandidature(many=True, read_only=True)
    
    class Meta(OffreEmploiSerializer.Meta):
        fields = OffreEmploiSerializer.Meta.fields + ['candidatures']


class OffreEmploiListSerializer(OffreEmploiSerializer):
    """
    Sérialiseur simplifié pour les listes
    """
    class Meta(OffreEmploiSerializer.Meta):
        fields = [
            'id', 'titre', 'entreprise_nom', 'ville', 'type_contrat',
            'niveau_experience', 'salaire_min', 'salaire_max', 'devise',
            'date_publication', 'est_urgent', 'est_remote', 'est_active',
            'nombre_candidatures', 'categories'
        ]