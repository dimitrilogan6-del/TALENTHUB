from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    CandidatDashboardView,
    ChangerMotDePasseView,
    FreelanceDashboardView,
    InscriptionViewSet,
    MonProfilViewSet,
    FreelanceViewSet,
    MessageViewSet,
    NotificationViewSet,
    ModifierUtilisateurView,
    RecruteurDashboardView,
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

      path(
            "changer-mot-de-passe/",
            ChangerMotDePasseView.as_view(),
            name="changer-mot-de-passe"
        ),

        path(
        "freelance/dashboard/",
        FreelanceDashboardView.as_view(),
        name="freelance-dashboard"
    ),

    path(
        "candidat/dashboard/",
        CandidatDashboardView.as_view(),
        name="candidat-dashboard"
        ),
    
    path(
        'recruteur/dashboard/',
        RecruteurDashboardView.as_view(),
        name='recruteur-dashboard'
),
]