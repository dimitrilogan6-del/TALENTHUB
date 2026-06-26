from django.urls import path,include# On importe les outils pour gérer les chemins (path) et les inclusions
from rest_framework.routers import DefaultRouter#On importe le routeur automatique de Django REST Framework
#On importe ton contrôleur (la vue) créé à l'étape précédente
from .views import CandidatureViewSet
# On crée un routeur automatique
router = DefaultRouter()
#On enregistre ton contrôleur sur le mot-clé 'candidatures'
# C'est ce qui va créer l'adresse : api/candidatures/
router.register(r'candidatures',CandidatureViewSet, basename='candidature')
#On connecte les routes générées automatiquement par le routeur à Django
urlpatterns = [
    path('', include(router.urls)),
]