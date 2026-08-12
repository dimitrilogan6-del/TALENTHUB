from django.contrib import admin
from django.contrib.auth.models import User

from .models import (
    Entreprise,
    Profil,
    RecruteurEntreprise,
    Message,
    Notification
)


# ============================================================
# ENTREPRISE
# ============================================================

@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):

    list_display = (
        'nom',
        'secteur',
        'email',
        'telephone',
        'statut',
        'verifiee',
        'created_at',
    )

    list_filter = (
        'statut',
        'verifiee',
        'secteur',
    )

    search_fields = (
        'nom',
        'email',
        'telephone',
        'secteur',
    )

    ordering = (
        '-created_at',
    )

    readonly_fields = (
        'created_at',
        'updated_at',
    )


# ============================================================
# RECRUTEUR / ENTREPRISE
# ============================================================

@admin.register(RecruteurEntreprise)
class RecruteurEntrepriseAdmin(admin.ModelAdmin):

    list_display = (
        'recruteur',
        'entreprise',
        'fonction',
        'principal',
        'actif',
        'dateAssociation',
    )

    list_filter = (
        'principal',
        'actif',
        'entreprise',
    )

    search_fields = (
        'recruteur__user__username',
        'recruteur__user__first_name',
        'recruteur__user__last_name',
        'entreprise__nom',
    )

    ordering = (
        '-dateAssociation',
    )

    autocomplete_fields = (
        'recruteur',
        'entreprise',
    )

    readonly_fields = (
        'dateAssociation',
    )


# ============================================================
# PROFIL
# ============================================================

@admin.register(Profil)
class ProfilAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        'role',
        'statut_compte',
        'statut_recruteur',
        'get_entreprises',
        'telephone',
        'created_at',
    )

    list_filter = (
        'role',
        'statut_compte',
        'statut_recruteur',
        'sexe',
    )

    search_fields = (
        'user__username',
        'user__first_name',
        'user__last_name',
        'user__email',
        'telephone',
        'numCni',
        'numPassport',
    )

    readonly_fields = (
        'created_at',
        'updated_at',
    )

    fieldsets = (

        # ----------------------------------------------------
        # COMPTE
        # ----------------------------------------------------

        (
            'Compte',
            {
                'fields': (
                    'user',
                    'role',
                    'statut_compte',
                )
            }
        ),

        # ----------------------------------------------------
        # INFORMATIONS PERSONNELLES
        # ----------------------------------------------------

        (
            'Informations personnelles',
            {
                'fields': (
                    'numCni',
                    'dateNaissance',
                    'lieuNaissance',
                    'telephone',
                    'numPassport',
                    'sexe',
                    'nationalite',
                    'photoProfil',
                )
            }
        ),

        # ----------------------------------------------------
        # CANDIDAT
        # ----------------------------------------------------

        (
            'Informations candidat',
            {
                'fields': (
                    'niveauEtude',
                    'dernierDiplome',
                    'dateObtentionDiplome',
                    'specialite',
                )
            }
        ),

        # ----------------------------------------------------
        # RECRUTEUR
        # ----------------------------------------------------

        (
            'Informations recruteur',
            {
                'fields': (
                    'dateEmbauche',
                    'fonction',
                    'statut_recruteur',
                )
            }
        ),

        # ----------------------------------------------------
        # FREELANCE
        # ----------------------------------------------------

        (
            'Informations freelance',
            {
                'fields': (
                    'titreProfessionnel',
                    'biographie',
                    'anneesExperience',
                    'tarifHoraire',
                    'deviseTarif',
                    'disponibilite',
                    'portfolioUrl',
                    'linkedinUrl',
                    'githubUrl',
                )
            }
        ),

        # ----------------------------------------------------
        # DATES
        # ----------------------------------------------------

        (
            'Informations système',
            {
                'fields': (
                    'created_at',
                    'updated_at',
                )
            }
        ),
    )

    # --------------------------------------------------------
    # Affichage des entreprises du recruteur
    # --------------------------------------------------------

    @admin.display(
        description='Entreprises'
    )
    def get_entreprises(self, obj):

        if obj.role != 'recruteur':
            return '-'

        entreprises = obj.entreprises.filter(
            associations_recruteurs__actif=True
        )

        if not entreprises.exists():
            return 'Aucune'

        return ', '.join(
            entreprise.nom
            for entreprise in entreprises
        )


# ============================================================
# MESSAGES
# ============================================================

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = (
        'expediteur',
        'destinataire',
        'dateEnvoi',
        'lu',
    )

    list_filter = (
        'lu',
        'dateEnvoi',
    )

    search_fields = (
        'expediteur__username',
        'destinataire__username',
        'contenu',
    )

    readonly_fields = (
        'dateEnvoi',
    )

    ordering = (
        '-dateEnvoi',
    )


# ============================================================
# NOTIFICATIONS
# ============================================================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):

    list_display = (
        'destinataire',
        'contenu',
        'dateEnvoi',
        'lu',
    )

    list_filter = (
        'lu',
        'dateEnvoi',
    )

    search_fields = (
        'destinataire__username',
        'contenu',
    )

    readonly_fields = (
        'dateEnvoi',
    )

    ordering = (
        '-dateEnvoi',
    )