from django.contrib import admin
from .models import Entreprise, Offre, Competence, NiveauCompetenceOffre

@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):
    list_display = ('nom', 'secteur', 'siteweb')
    search_fields = ('nom',)

@admin.register(Offre)
class OffreAdmin(admin.ModelAdmin):
    list_display = ('titre', 'entreprise', 'datePublication', 'dateLimite')
    list_filter = ('typeOffre', 'datePublication')
    search_fields = ('titre', 'description')

@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'niveau')
    search_fields = ('nom',)

@admin.register(NiveauCompetenceOffre)
class NiveauCompetenceOffreAdmin(admin.ModelAdmin):
    list_display = ('offre', 'competence', 'niveauRequis', 'estObligatoire')



from django.contrib import admin
from .models import Entreprise, Offre, Competence, NiveauCompetenceOffre


@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'niveau')
    search_fields = ('nom',)

@admin.register(NiveauCompetenceOffre)
class NiveauCompetenceOffreAdmin(admin.ModelAdmin):
    list_display = ('offre', 'competence', 'niveauRequis', 'estObligatoire')
