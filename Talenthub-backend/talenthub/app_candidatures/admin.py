
from django.contrib import admin
from .models import Candidature

@admin.register(Candidature)
class CandidatureAdmin(admin.ModelAdmin):
    list_display = ('candidat', 'offre', 'statut', 'dateSoumission')
    list_filter = ('statut', 'dateSoumission')
    search_fields = ('candidat__username', 'offre__titre')

