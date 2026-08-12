from django.utils import timezone as django_timezone
from django.contrib.auth.models import User

from rest_framework import ( viewsets, permissions, status)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app_candidatures.models import Candidature, Entretien

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.decorators import action

from .models import ( Entreprise, Profil, RecruteurEntreprise, Message, Notification,)
from .serializers import (
    FreelanceSerializer,
    UserSerializer,
    ProfilSerializer,
    InscriptionSerializer,
    EntrepriseSerializer,
    RecruteurEntrepriseSerializer,
    MessageSerializer,
    NotificationSerializer,
)

# ============================================================
# PERMISSION ADMINISTRATEUR
# ============================================================

class IsAdministrateur(
    permissions.BasePermission
):
    """
    Autorise uniquement les administrateurs
    de la plateforme.
    """

    def has_permission(
        self,
        request,
        view
    ):

        return (
            request.user.is_authenticated
            and (
                request.user.is_staff
                or request.user.is_superuser
            )
        )


# ============================================================
# INSCRIPTION
# ============================================================

class InscriptionViewSet(
    viewsets.ModelViewSet
):

    queryset = Profil.objects.all()

    permission_classes = [
        permissions.AllowAny
    ]

    def get_serializer_class(self):

        if self.action == "create":
            return InscriptionSerializer

        return ProfilSerializer

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        profil = serializer.save()

        read_serializer = ProfilSerializer(
            profil
        )

        return Response(
            read_serializer.data,
            status=status.HTTP_201_CREATED
        )

# ============================================================
# MON PROFIL
# ============================================================

class MonProfilViewSet(
    viewsets.ModelViewSet
):

    serializer_class = ProfilSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        return Profil.objects.filter(
            user=self.request.user
        )

    def get_object(self):

        return self.request.user.profil


# ============================================================
# MODIFICATION UTILISATEUR
# ============================================================

class ModifierUtilisateurView(
    APIView
):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def put(
        self,
        request
    ):

        user = request.user

        serializer = UserSerializer(
            user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
# ============================================================
# FREELANCES
# ============================================================

class FreelanceViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = FreelanceSerializer

    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):

        return (
            Profil.objects
            .filter(
                role="freelance",
                statut_compte="actif"
            )
            .select_related(
                "user"
            )
            .order_by(
                "-created_at"
            )
        )
# ============================================================
# ENTREPRISES
# ============================================================

class EntrepriseViewSet(
    viewsets.ModelViewSet
):

    serializer_class = EntrepriseSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        # ----------------------------------------------------
        # ADMIN
        # ----------------------------------------------------

        if (
            user.is_staff
            or user.is_superuser
        ):

            return Entreprise.objects.all().order_by(
                "-created_at"
            )

        # ----------------------------------------------------
        # RECRUTEUR
        # ----------------------------------------------------

        if hasattr(user, "profil"):

            profil = user.profil

            if profil.role == "recruteur":

                return Entreprise.objects.filter(
                    recruteurs=profil,
                    associations_recruteurs__actif=True
                ).distinct().order_by(
                    "-created_at"
                )

        return Entreprise.objects.none()

    def perform_create(
        self,
        serializer
    ):

        user = self.request.user

        # Seul l'administrateur peut
        # créer directement une entreprise.

        if not (
            user.is_staff
            or user.is_superuser
        ):

            raise permissions.PermissionDenied(
                "Seul un administrateur peut créer "
                "une entreprise."
            )

        serializer.save()

    @action(
        detail=True,
        methods=["get"]
    )
    def recruteurs(
        self,
        request,
        pk=None
    ):

        entreprise = self.get_object()

        associations = (
            RecruteurEntreprise.objects
            .filter(
                entreprise=entreprise,
                actif=True
            )
            .select_related(
                "recruteur__user"
            )
        )

        serializer = (
            RecruteurEntrepriseSerializer(
                associations,
                many=True
            )
        )

        return Response(
            serializer.data
        )


# ============================================================
# ASSOCIATION RECRUTEUR / ENTREPRISE
# ============================================================

class RecruteurEntrepriseViewSet(
    viewsets.ModelViewSet
):

    serializer_class = (
        RecruteurEntrepriseSerializer
    )

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        # ADMIN
        if (
            user.is_staff
            or user.is_superuser
        ):

            return RecruteurEntreprise.objects.all()

        # RECRUTEUR
        if hasattr(user, "profil"):

            profil = user.profil

            if profil.role == "recruteur":

                return (
                    RecruteurEntreprise.objects
                    .filter(
                        recruteur=profil
                    )
                )

        return RecruteurEntreprise.objects.none()

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        user = request.user

        # Seul un administrateur peut
        # officiellement affecter un recruteur
        # à une entreprise.

        if not (
            user.is_staff
            or user.is_superuser
        ):

            return Response(
                {
                    "detail":
                    "Seul un administrateur peut "
                    "associer un recruteur à une entreprise."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        entreprise_id = request.data.get(
            "entreprise_id"
        )

        recruteur_id = request.data.get(
            "recruteur_id"
        )

        if not entreprise_id:
            return Response(
                {
                    "entreprise_id":
                    "Ce champ est obligatoire."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not recruteur_id:
            return Response(
                {
                    "recruteur_id":
                    "Ce champ est obligatoire."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            entreprise = Entreprise.objects.get(
                id=entreprise_id
            )

        except Entreprise.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Entreprise introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        try:

            recruteur = Profil.objects.get(
                id=recruteur_id,
                role="recruteur"
            )

        except Profil.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Recruteur introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Vérification doublon

        if RecruteurEntreprise.objects.filter(
            recruteur=recruteur,
            entreprise=entreprise
        ).exists():

            return Response(
                {
                    "detail":
                    "Ce recruteur est déjà associé "
                    "à cette entreprise."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        association = serializer.save(
            recruteur=recruteur,
            entreprise=entreprise
        )

        return Response(
            self.get_serializer(
                association
            ).data,
            status=status.HTTP_201_CREATED
        )


# ============================================================
# MESSAGES
# ============================================================

class MessageViewSet(
    viewsets.ModelViewSet
):

    serializer_class = MessageSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        return Message.objects.filter(
            destinataire=user
        ).select_related(
            "expediteur"
        ).order_by(
            "-dateEnvoi"
        )

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        destinataire_id = request.data.get(
            "destinataire_id"
        )

        contenu = request.data.get(
            "contenu"
        )

        if not destinataire_id:

            return Response(
                {
                    "destinataire_id":
                    "Le destinataire est obligatoire."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not contenu or not contenu.strip():

            return Response(
                {
                    "contenu":
                    "Le message ne peut pas être vide."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            destinataire = User.objects.get(
                id=destinataire_id
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Destinataire introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Empêcher de s'envoyer un message
        # à soi-même.

        if destinataire == request.user:

            return Response(
                {
                    "detail":
                    "Vous ne pouvez pas vous envoyer "
                    "un message à vous-même."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        message = Message.objects.create(
            expediteur=request.user,
            destinataire=destinataire,
            contenu=contenu.strip()
        )

        return Response(
            MessageSerializer(
                message
            ).data,
            status=status.HTTP_201_CREATED
        )

    @action(
        detail=True,
        methods=["patch"]
    )
    def marquer_lu(
        self,
        request,
        pk=None
    ):

        message = self.get_object()

        message.lu = True
        message.save(
            update_fields=["lu"]
        )

        return Response(
            {
                "message":
                "Message marqué comme lu."
            }
        )


# ============================================================
# NOTIFICATIONS
# ============================================================

class NotificationViewSet(
    viewsets.ModelViewSet
):

    serializer_class = NotificationSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        return (
            Notification.objects
            .filter(
                destinataire=self.request.user
            )
            .order_by(
                "-dateEnvoi"
            )
        )

    @action(
        detail=True,
        methods=["patch"]
    )
    def marquer_lue(
        self,
        request,
        pk=None
    ):

        notification = self.get_object()

        notification.lu = True

        notification.save(
            update_fields=["lu"]
        )

        return Response(
            {
                "message":
                "Notification marquée comme lue."
            }
        )

    @action(
        detail=False,
        methods=["patch"]
    )
    def tout_marquer_lu(
        self,
        request
    ):

        self.get_queryset().filter(
            lu=False
        ).update(
            lu=True
        )

        return Response(
            {
                "message":
                "Toutes les notifications "
                "ont été marquées comme lues."
            }
        )


# ============================================================
# ADMINISTRATEUR
# ============================================================

class AdministrationViewSet(
    viewsets.ViewSet
):

    permission_classes = [
        IsAdministrateur
    ]

    @action(
        detail=False,
        methods=["get"]
    )
    def statistiques(
        self,
        request
    ):

        return Response(
            {
                "utilisateurs": User.objects.count(),

                "candidats": Profil.objects.filter(
                    role="candidat"
                ).count(),

                "recruteurs": Profil.objects.filter(
                    role="recruteur"
                ).count(),

                "freelances": Profil.objects.filter(
                    role="freelance"
                ).count(),

                "entreprises": Entreprise.objects.count(),

                "entreprises_verifiees":
                    Entreprise.objects.filter(
                        verifiee=True
                    ).count(),

                "entreprises_en_attente":
                    Entreprise.objects.filter(
                        statut="en_attente"
                    ).count(),

                "recruteurs_verifies":
                    Profil.objects.filter(
                        role="recruteur",
                        statut_recruteur="verifie"
                    ).count(),
            }
        )

    @action(
        detail=True,
        methods=["patch"]
    )
    def suspendre_entreprise(
        self,
        request,
        pk=None
    ):

        try:

            entreprise = Entreprise.objects.get(
                pk=pk
            )

        except Entreprise.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Entreprise introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        entreprise.statut = "suspendue"
        entreprise.verifiee = False

        entreprise.save(
            update_fields=[
                "statut",
                "verifiee",
                "updated_at"
            ]
        )

        return Response(
            {
                "message":
                "Entreprise suspendue avec succès."
            }
        )

    @action(
        detail=True,
        methods=["patch"]
    )
    def verifier_entreprise(
        self,
        request,
        pk=None
    ):

        try:

            entreprise = Entreprise.objects.get(
                pk=pk
            )

        except Entreprise.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Entreprise introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        entreprise.statut = "active"
        entreprise.verifiee = True

        entreprise.save(
            update_fields=[
                "statut",
                "verifiee",
                "updated_at"
            ]
        )

        return Response(
            {
                "message":
                "Entreprise vérifiée avec succès."
            }
        )

class CandidatDashboardView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user = request.user

        # =====================================================
        # PROFIL
        # =====================================================

        try:
            profil = user.profil
        except Profil.DoesNotExist:
            profil = None

        nom_complet = (
            f"{user.first_name} {user.last_name}"
        ).strip()

        if not nom_complet:
            nom_complet = user.username

        profile_completion = 0

        if profil:
            profile_completion = profil.profile_completion

        # =====================================================
        # CANDIDATURES
        # =====================================================

        candidatures = (
            Candidature.objects
            .filter(
                candidat=user
            )
            .select_related(
                "offre",
                "offre__entreprise"
            )
            .order_by(
                "-dateSoumission"
            )
        )

        # =====================================================
        # STATISTIQUES
        # =====================================================

        total_candidatures = candidatures.count()

        candidatures_en_attente = candidatures.filter(
            statut="En attente"
        ).count()

        candidatures_presselectionnees = candidatures.filter(
            statut="Présélectionnée"
        ).count()

        candidatures_entretien = candidatures.filter(
            statut="Entretien"
        ).count()

        candidatures_acceptees = candidatures.filter(
            statut="Acceptée"
        ).count()

        candidatures_refusees = candidatures.filter(
            statut="Refusée"
        ).count()

        # =====================================================
        # CANDIDATURES RÉCENTES
        # =====================================================

        candidatures_recentes = []

        for candidature in candidatures[:5]:

            entreprise_nom = "Entreprise inconnue"

            if candidature.offre.entreprise:
                entreprise_nom = (
                    candidature.offre.entreprise.nom
                )

            candidatures_recentes.append({

                "id": candidature.id,

                "offre_id": candidature.offre.id,

                "titre_offre":
                    candidature.offre.titre,

                "entreprise":
                    entreprise_nom,

                "statut":
                    candidature.statut,

                "date":
                    candidature.dateSoumission,

            })

        # =====================================================
        # ENTRETIENS À VENIR
        # =====================================================

        maintenant = django_timezone.now()

        entretiens = (
            Entretien.objects
            .filter(
                candidature__candidat=user,
                dateHeure__gte=maintenant,
                statut__in=[
                    "Planifié",
                    "Confirmé"
                ]
            )
            .select_related(
                "candidature",
                "candidature__offre",
                "candidature__offre__entreprise"
            )
            .order_by(
                "dateHeure"
            )
        )

        entretiens_a_venir = []

        for entretien in entretiens[:5]:

            entreprise_nom = "Entreprise inconnue"

            if entretien.candidature.offre.entreprise:
                entreprise_nom = (
                    entretien
                    .candidature
                    .offre
                    .entreprise
                    .nom
                )

            entretiens_a_venir.append({

                "id":
                    entretien.id,

                "titre_offre":
                    entretien
                    .candidature
                    .offre
                    .titre,

                "entreprise":
                    entreprise_nom,

                "dateHeure":
                    entretien.dateHeure,

                "type":
                    entretien.type,

                "lieu":
                    entretien.lieu,

                "lienVisio":
                    entretien.lienVisio,

                "statut":
                    entretien.statut,

                "reponseCandidat":
                    entretien.reponseCandidat,

            })

        # =====================================================
        # PROCHAIN ENTRETIEN
        # =====================================================

        prochain_entretien = None

        if entretiens_a_venir:

            prochain_entretien = (
                entretiens_a_venir[0]
            )

        # =====================================================
        # RÉPONSE
        # =====================================================

        return Response({

            "utilisateur": {

                "id":
                    user.id,

                "username":
                    user.username,

                "prenom":
                    user.first_name,

                "nom":
                    user.last_name,

                "nom_complet":
                    nom_complet,

                "email":
                    user.email,

            },

            "profil": {

                "id":
                    profil.id if profil else None,

                "role":
                    profil.role if profil else "candidat",

                "telephone":
                    profil.telephone if profil else None,

                "specialite":
                    profil.specialite if profil else None,

                "niveauEtude":
                    profil.niveauEtude if profil else None,

                "dernierDiplome":
                    profil.dernierDiplome if profil else None,

                "photoProfil":
                    (
                        request.build_absolute_uri(
                            profil.photoProfil.url
                        )
                        if (
                            profil
                            and profil.photoProfil
                        )
                        else None
                    ),

                "profile_completion":
                    profile_completion,

            },

            "statistiques": {

                "total_candidatures":
                    total_candidatures,

                "candidatures_en_attente":
                    candidatures_en_attente,

                "candidatures_presselectionnees":
                    candidatures_presselectionnees,

                "candidatures_entretien":
                    candidatures_entretien,

                "candidatures_acceptees":
                    candidatures_acceptees,

                "candidatures_refusees":
                    candidatures_refusees,

            },

            "prochain_entretien":
                prochain_entretien,

            "candidatures_recentes":
                candidatures_recentes,

            "entretiens_a_venir":
                entretiens_a_venir,

        })
    