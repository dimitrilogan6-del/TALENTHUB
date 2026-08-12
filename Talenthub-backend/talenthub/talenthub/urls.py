from django.contrib import admin

from django.urls import (
    path,
    include
)

from django.conf import settings
from django.conf.urls.static import static

from app_users.views import CandidatDashboardView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)


urlpatterns = [

    # ========================================================
    # ADMIN DJANGO
    # ========================================================

    path(
        'admin/',
        admin.site.urls
    ),


    # ========================================================
    # UTILISATEURS
    # ========================================================

    path(
        'api/',
        include('app_users.urls')
    ),


    # ========================================================
    # JWT
    # ========================================================

    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),


    # ========================================================
    # OFFRES
    # ========================================================

    path(
        'api/offres/',
        include('offres.urls')
    ),


    # ========================================================
    # CANDIDATURES
    # ========================================================

    path(
        'api/candidatures/',
        include('app_candidatures.urls')
    ),

     path(
        "api/dashboard/",
        CandidatDashboardView.as_view(),
        name="candidat-dashboard"
    ),
]


# ============================================================
# MEDIA
# ============================================================

if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )