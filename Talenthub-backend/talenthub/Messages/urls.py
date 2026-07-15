
from django.urls import path, include
from rest_framework.routers import DefaultRouter


from .views import MessagesViewSet
router = DefaultRouter()
router.register(r'Messages', MessagesViewSet, basename='Messages')
urlpatterns = [
    path('', include(router.urls)),
]
