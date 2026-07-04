from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompetenceViewSet

# Création du routeur
router = DefaultRouter()
router.register(r'competences', CompetenceViewSet, basename='competence')

urlpatterns = [
    path('', include(router.urls)),
]
