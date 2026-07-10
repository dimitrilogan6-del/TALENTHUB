from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app_users.urls')), 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api-auth/', include('rest_framework.urls')),  # Pour l'interface de navigation DRF
    path('api/documents/', include('documents.urls')),  # Inclure les URLs de l'application documents                                                               
    path('api/offres/', include('offres.urls')),
   path('api/competences/', include('Competances.urls')),
]

