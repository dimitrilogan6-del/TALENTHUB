from django.contrib import admin
from .models import (
    Entreprise,
    Offre,
    Competence,
    NiveauCompetenceOffre
)

# ============================================================
# COMPETENCE
# ============================================================

@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):

    list_display = (
        'nom',
        'created_at',
    )

    search_fields = (
        'nom',
    )

    ordering = (
        'nom',
    )


# ============================================================
# NIVEAU COMPETENCE OFFRE
# ============================================================

@admin.register(NiveauCompetenceOffre)
class NiveauCompetenceOffreAdmin(admin.ModelAdmin):

    list_display = (
        'offre',
        'competence',
        'niveauRequis',
        'estObligatoire',
    )

    list_filter = (
        'estObligatoire',
        'niveauRequis',
    )

    search_fields = (
        'offre__titre',
        'competence__nom',
    )


# ============================================================
# OFFRE
# ============================================================

@admin.register(Offre)
class OffreAdmin(admin.ModelAdmin):

    list_display = (
        'titre',
        'entreprise',
        'recruteur',
        'typeOffre',
        'datePublication',
        'dateLimite',
    )

    list_filter = (
        'typeOffre',
        'entreprise',
        'dateLimite',
    )

    search_fields = (
        'titre',
        'description',
        'entreprise__nom',
        'recruteur__username',
    )

    readonly_fields = (
        'datePublication',
        'created_at',
        'updated_at',
    )

    ordering = (
        '-datePublication',
    )