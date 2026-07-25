from django.contrib import admin
from .models import Entretien
# Register your models here.
@admin.register(Entretien)
class EntretienAdmin(admin.ModelAdmin):
    list_display = ('dateHeure', 'type', 'statut', 'recruteur', 'candidature')
    list_filter = ('type', 'statut')