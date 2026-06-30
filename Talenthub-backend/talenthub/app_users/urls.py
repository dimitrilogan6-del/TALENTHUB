from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InscriptionViewSet, MonProfilViewSet

# Création du routeur
router = DefaultRouter()
router.register(r'inscription', InscriptionViewSet, basename='inscription')
router.register(r'profil', MonProfilViewSet, basename='profil')

urlpatterns = [
    path('', include(router.urls)), 
]