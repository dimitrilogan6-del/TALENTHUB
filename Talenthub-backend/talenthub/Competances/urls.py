from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompetenceViewSet, NiveauCompetenceOffreViewSet

router = DefaultRouter()
router.register(r'competences', CompetenceViewSet, basename='competences')
router.register(r'niveau-competences', NiveauCompetenceOffreViewSet, basename='niveau-competences')

urlpatterns = [
    path('', include(router.urls)),
]