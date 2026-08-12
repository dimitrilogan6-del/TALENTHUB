from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    InscriptionViewSet,
    MonProfilViewSet,
    FreelanceViewSet,
    MessageViewSet,
    NotificationViewSet,
    ModifierUtilisateurView,
)


router = DefaultRouter()


# ============================================================
# INSCRIPTION
# ============================================================

router.register(
    r'inscription',
    InscriptionViewSet,
    basename='inscription'
)


# ============================================================
# MON PROFIL
# ============================================================

router.register(
    r'profil',
    MonProfilViewSet,
    basename='profil'
)


# ============================================================
# FREELANCES
# ============================================================

router.register(
    r'freelances',
    FreelanceViewSet,
    basename='freelances'
)


# ============================================================
# MESSAGES
# ============================================================

router.register(
    r'messages',
    MessageViewSet,
    basename='messages'
)


# ============================================================
# NOTIFICATIONS
# ============================================================

router.register(
    r'notifications',
    NotificationViewSet,
    basename='notifications'
)


urlpatterns = [

    path(
        '',
        include(router.urls)
    ),

    path(
        'utilisateur/modifier/',
        ModifierUtilisateurView.as_view(),
        name='modifier-utilisateur'
    ),
]