from django.contrib import admin
from .models import Competence


@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):
    list_display = ['nom', 'niveau', 'description']
    list_filter = ['niveau']
    search_fields = ['nom', 'description']
