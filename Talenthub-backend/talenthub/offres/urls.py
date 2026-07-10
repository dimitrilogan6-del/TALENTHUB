from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OffreEmploiViewSet, CategorieViewSet, OffreEmploiRechercheAvancee
)

# Créer un routeur pour les ViewSets
router = DefaultRouter()
router.register(r'offres', OffreEmploiViewSet, basename='offre')
router.register(r'categories', CategorieViewSet, basename='categorie')

urlpatterns = [
    # Routes du routeur
    path('', include(router.urls)),
    
    # Recherche avancée
    path('recherche-avancee/', OffreEmploiRechercheAvancee.as_view(), name='recherche_avancee'),
    
    # Statistiques (optionnel)
    path('statistiques/', include('stats.urls')), 
    # Si vous avez des stats
]