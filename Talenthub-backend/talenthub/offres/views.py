from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import DjangoFilterBackend
from rest_framework import Q
from .models import OffreEmploi, Categorie, Candidature
from .serializers import (
    OffreEmploiSerializer,
    OffreEmploiDetailSerializer,
    OffreEmploiListSerializer,
    CategorieSerializer,
)


class OffreEmploiViewSet(ModelViewSet):
    """
    ViewSet pour gérer les offres d'emploi (CRUD complet)
    """

    queryset = OffreEmploi.objects.all().select_related("entreprise", "recruteur")
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "type_contrat",
        "niveau_experience",
        "statut",
        "ville",
        "est_remote",
    ]
    search_fields = ["titre", "description", "competences_requises", "ville"]
    ordering_fields = ["date_publication", "salaire_min", "nombre_candidatures"]
    ordering = ["-date_publication"]

    def get_permissions(self):
        """
        Permissions selon l'action
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        elif self.action in ["create"]:
            permission_classes = [IsAuthenticated, IsRecruteurs]  # noqa: F821
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IspropriétaireOffres]  # noqa: F821
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        """
        Sérialiseur différent selon l'action
        """
        if self.action == "list":
            return OffreEmploiListSerializer
        elif self.action == "retrieve":
            return OffreEmploiDetailSerializer
        return OffreEmploiSerializer

    def get_queryset(self):
        """
        Filtrer le queryset selon l'utilisateur
        """
        queryset = super().get_queryset()

        # Filtrer par statut si non authentifié
        if not self.request.user.is_authenticated:
            return queryset.filter(statut=OffreEmploi.StatutOffre.PUBLIEE)

        # Pour les recruteurs : voir leurs offres + offres publiques
        if (
            hasattr(self.request.user, "est_recruteur")
            and self.request.user.est_recruteur
        ):
            return queryset.filter(
                Q(recruteur=self.request.user)
                | Q(statut=OffreEmploi.StatutOffre.PUBLIEE)
            )

        return queryset

    def perform_create(self, serializer):
        """
        Créer une offre en associant l'utilisateur comme recruteur
        """
        serializer.save(
            recruteur=self.request.user, nombre_candidatures=0, nombre_vues=0
        )

    @action(detail=True, methods=["post"])
    def augmenter_vues(self, request, pk=None):
        """
        Action personnalisée pour incrémenter les vues
        """
        offre = self.get_object()
        offre.augmenter_vues()
        return Response({"message": "Vue enregistrée"})

    @action(detail=True, methods=["post"])
    def postuler(self, request, pk=None):
        """
        Action pour postuler à une offre
        """
        offre = self.get_object()

        # Vérifier que l'offre est active
        if not offre.est_active():
            return Response(
                {"error": "Cette offre n'est plus active"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Vérifier que l'utilisateur n'a pas déjà postulé
        if Candidature.objects.filter(offre=offre, candidat=request.user).exists():
            return Response(
                {"error": "Vous avez déjà postulé à cette offre"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Créer la candidature
        candidature = Candidature.objects.create(
            offre=offre, candidat=request.user, message=request.data.get("message", "")
        )

        # Incrémenter le compteur de candidatures
        offre.nombre_candidatures += 1
        offre.save(update_fields=["nombre_candidatures"])

        serializer = OffreCandidatureSerializer(candidature)  # noqa: F821
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def candidatures(self, request, pk=None):
        """
        Récupérer toutes les candidatures pour une offre
        """
        offre = self.get_object()

        # Vérifier que l'utilisateur est autorisé
        if not offre.recruteur == request.user and not request.user.is_staff:
            return Response(
                {"error": "Vous n'êtes pas autorisé à voir les candidatures"},
                status=status.HTTP_403_FORBIDDEN,
            )

        candidatures = offre.candidatures.all()
        serializer = OffreCandidatureSerializer(candidatures, many=True)  # noqa: F821
        return Response(serializer.data)


class CategorieViewSet(ModelViewSet):
    """
    ViewSet pour gérer les catégories
    """

    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["nom", "description"]


class OffreEmploiRechercheAvancee(generics.ListAPIView):
    """
    Vue pour la recherche avancée d'offres
    """

    serializer_class = OffreEmploiListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = OffreEmploi.objects.filter(statut=OffreEmploi.StatutOffre.PUBLIEE)

        # Paramètres de recherche
        mot_cle = self.request.query_params.get("mot_cle", "")
        ville = self.request.query_params.get("ville", "")
        type_contrat = self.request.query_params.get("type_contrat", "")
        niveau_experience = self.request.query_params.get("niveau_experience", "")
        salaire_min = self.request.query_params.get("salaire_min", "")
        salaire_max = self.request.query_params.get("salaire_max", "")
        remote = self.request.query_params.get("remote", "")
        categorie = self.request.query_params.get("categorie", "")

        # Filtres
        if mot_cle:
            queryset = queryset.filter(
                Q(titre__icontains=mot_cle)
                | Q(description__icontains=mot_cle)
                | Q(competences_requises__icontains=mot_cle)
            )

        if ville:
            queryset = queryset.filter(ville__icontains=ville)

        if type_contrat:
            queryset = queryset.filter(type_contrat=type_contrat)

        if niveau_experience:
            queryset = queryset.filter(niveau_experience=niveau_experience)

        if salaire_min:
            queryset = queryset.filter(salaire_min__gte=salaire_min)

        if salaire_max:
            queryset = queryset.filter(salaire_max__lte=salaire_max)

        if remote.lower() in ["true", "1", "yes"]:
            queryset = queryset.filter(est_remote=True)

        if categorie:
            queryset = queryset.filter(categories__categorie__id=categorie)

        return queryset.distinct()
