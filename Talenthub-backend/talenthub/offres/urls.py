from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    EntrepriseViewSet,
    CompetenceViewSet,
    OffreViewSet,
)

router = DefaultRouter()

router.register(
    r'entreprises',
    EntrepriseViewSet,
    basename='entreprises'
)

router.register(
    r'mes-entreprises',
    EntrepriseViewSet,
    basename='mes-entreprises'
)

router.register(
    r'competences',
    CompetenceViewSet,
    basename='competences'
)

router.register(
    r'offres',
    OffreViewSet,
    basename='offres'
)

router.register(
    r'mes_offres',
    OffreViewSet,
    basename='mes_offres'
)


urlpatterns = [
    path('', include(router.urls)),
]