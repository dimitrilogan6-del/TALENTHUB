from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MissionViewSet,
    CandidatureMissionViewSet,
    RecruteurCandidatureMissionViewSet,
    RecruteurMissionViewSet,
)


router = DefaultRouter()

router.register(
    r'missions',
    MissionViewSet,
    basename='missions'
)

router.register(
    r'candidatures_missions',
    CandidatureMissionViewSet,
    basename='candidatures-missions'
)

router.register(
    r'recruteur/missions',
    RecruteurMissionViewSet,
    basename='recruteur-missions'
)

router.register(
    r'freelance_candidature',
    RecruteurCandidatureMissionViewSet,
    basename='freelance_candidature'
)

urlpatterns = [
    path(
        '',
        include(router.urls)
    ),
]