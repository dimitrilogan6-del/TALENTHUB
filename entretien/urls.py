from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import EntretienViewSet

router = DefaultRouter()
router.register(r'entretiens', EntretienViewSet)

urlpatterns = [
    path('', include(router.urls)),
]