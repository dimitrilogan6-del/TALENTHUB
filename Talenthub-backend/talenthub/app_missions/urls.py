from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MissionViewSet,
    CandidatureMissionViewSet,
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


urlpatterns = [
    path(
        '',
        include(router.urls)
    ),
]