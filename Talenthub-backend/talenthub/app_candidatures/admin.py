from django.contrib import admin
from .models import Candidature, Document, Entretien

@admin.register(Candidature)
class CandidatureAdmin(admin.ModelAdmin):
    list_display = ('candidat', 'offre', 'statut', 'dateSoumission')
    list_filter = ('statut', 'dateSoumission')
    search_fields = ('candidat__username', 'offre__titre')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('nomFichier', 'typeFichier', 'candidature')

@admin.register(Entretien)
class EntretienAdmin(admin.ModelAdmin):
    list_display = ('dateHeure', 'type', 'statut', 'recruteur', 'candidature')
    list_filter = ('type', 'statut')