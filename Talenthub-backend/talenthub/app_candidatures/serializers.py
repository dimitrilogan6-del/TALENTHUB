from rest_framework import serializers
from .models import Candidature
from django.utils import timezone

class CandidatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidature
        fields = '__all__'
         # On ne peut pas modifier la date de soumission
        read_only_fields = ['dateSoumission'] 

    def create(self, validated_data):
        validated_data['candidat'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Règle 1 : Vérifier si la date limite de l'offre est dépassée
        if instance.offre.dateLimite < timezone.now().date():
            raise serializers.ValidationError(
                "La date limite de cette offre est dépassée. Vous ne pouvez plus modifier votre candidature."
            )

        # Règle 2 : Vérifier si la candidature a déjà été modifiée une fois En comparant dateSoumission et dateModification
        if instance.dateSoumission.date() != instance.dateModification.date():
            raise serializers.ValidationError(
                "Vous avez déjà modifié cette candidature une fois. Les modifications ultérieures ne sont pas autorisées."
            )

        # Si tout est valide, on applique la mise à jour
        return super().update(instance, validated_data)