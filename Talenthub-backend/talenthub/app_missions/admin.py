from django.contrib import admin

from .models import (
    Mission,
    CompetenceMission,
    CandidatureMission,
)


@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):

    list_display = (
        "titre",
        "entreprise",
        "recruteur",
        "typeMission",
        "budgetMin",
        "budgetMax",
        "modeTravail",
        "statut",
        "dateLimite",
    )

    list_filter = (
        "statut",
        "typeMission",
        "modeTravail",
        "deviseBudget",
    )

    search_fields = (
        "titre",
        "description",
        "entreprise__nom",
        "recruteur__username",
    )

    readonly_fields = (
        "datePublication",
        "created_at",
        "updated_at",
    )


@admin.register(CompetenceMission)
class CompetenceMissionAdmin(admin.ModelAdmin):

    list_display = (
        "mission",
        "nom",
        "niveauRequis",
        "estObligatoire",
    )

    list_filter = (
        "niveauRequis",
        "estObligatoire",
    )

    search_fields = (
        "nom",
        "mission__titre",
    )


@admin.register(CandidatureMission)
class CandidatureMissionAdmin(admin.ModelAdmin):

    list_display = (
        "mission",
        "freelance",
        "montantPropose",
        "delaiPropose",
        "statut",
        "dateCandidature",
    )

    list_filter = (
        "statut",
    )

    search_fields = (
        "mission__titre",
        "freelance__user__username",
        "freelance__user__first_name",
        "freelance__user__last_name",
    )

    readonly_fields = (
        "dateCandidature",
        "updated_at",
    )