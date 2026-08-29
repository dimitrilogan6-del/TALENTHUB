from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CandidatureViewSet,
    DocumentViewSet,
    EntretienViewSet,
)

router = DefaultRouter()

router.register(
    r'candidatures',
    CandidatureViewSet,
    basename='candidatures'
)

router.register(
    r'documents',
    DocumentViewSet,
    basename='documents'
)

router.register(
    r'entretiens',
    EntretienViewSet,
    basename='entretiens'
)

urlpatterns = [

    path(
        '',
        include(router.urls)
    ),
]