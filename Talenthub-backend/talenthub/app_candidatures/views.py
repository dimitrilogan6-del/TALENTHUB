from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import (
    viewsets,
    permissions,
    status
)

from rest_framework.response import Response

from .models import (
    Candidature,
    Document,
    Entretien
)

from .serializers import (
    CandidatureSerializer,
    DocumentSerializer,
    EntretienSerializer,
    CandidatureStatutSerializer
)


# ==============================================================
# UTILITAIRES
# ==============================================================

def est_administrateur(user):

    return (
        user.is_superuser
        or (
            hasattr(user, 'profil')
            and user.profil.role == 'admin'
        )
    )


def est_recruteur(user):

    return (
        hasattr(user, 'profil')
        and user.profil.role == 'recruteur'
    )


def est_candidat(user):

    return (
        hasattr(user, 'profil')
        and user.profil.role == 'candidat'
    )


def recruteur_de_l_entreprise(user, entreprise):

    if not est_recruteur(user):
        return False

    profil = user.profil

    # Nouvelle architecture :
    # un recruteur peut appartenir à plusieurs entreprises

    return profil.entreprises.filter(
        id=entreprise.id
    ).exists()


# ==============================================================
# CANDIDATURES
# ==============================================================

class CandidatureViewSet(viewsets.ModelViewSet):

    serializer_class = CandidatureSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # ----------------------------------------------------------
    # LISTE
    # ----------------------------------------------------------

    def get_queryset(self):

        user = self.request.user

        # Administrateur :
        # accès à toutes les candidatures

        if est_administrateur(user):

            return Candidature.objects.select_related(
                'candidat',
                'offre',
                'offre__entreprise'
            ).prefetch_related(
                'documents',
                'entretiens'
            )

        # Candidat :
        # uniquement ses candidatures

        if est_candidat(user):

            return Candidature.objects.filter(
                candidat=user
            ).select_related(
                'offre',
                'offre__entreprise'
            ).prefetch_related(
                'documents',
                'entretiens'
            )

        # Recruteur :
        # uniquement les candidatures des offres
        # appartenant à ses entreprises

        if est_recruteur(user):

            entreprises = user.profil.entreprises.all()

            return Candidature.objects.filter(
                offre__entreprise__in=entreprises
            ).select_related(
                'candidat',
                'offre',
                'offre__entreprise'
            ).prefetch_related(
                'documents',
                'entretiens'
            ).distinct()

        return Candidature.objects.none()

    # ----------------------------------------------------------
    # CREATION
    # ----------------------------------------------------------

    def create(self, request, *args, **kwargs):

        if not est_candidat(request.user):

            return Response(
                {
                    'detail':
                        'Seuls les candidats peuvent postuler.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        candidature = serializer.save(
            candidat=request.user
        )

        return Response(
            CandidatureSerializer(
                candidature,
                context={'request': request}
            ).data,
            status=status.HTTP_201_CREATED
        )

    # ----------------------------------------------------------
    # MODIFICATION
    # ----------------------------------------------------------

    def update(self, request, *args, **kwargs):

        candidature = self.get_object()

        # Un candidat ne peut pas modifier
        # le statut ou les décisions du recruteur

        if est_candidat(request.user):

            if candidature.candidat != request.user:

                return Response(
                    {
                        'detail':
                            'Vous ne pouvez pas modifier cette candidature.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            candidature.lettreMotivation = request.data.get(
                'lettreMotivation',
                candidature.lettreMotivation
            )

            candidature.nombre_modifications += 1

            candidature.save()

            return Response(
                self.get_serializer(candidature).data
            )

        # Recruteur
        if est_recruteur(request.user):

            if not recruteur_de_l_entreprise(
                request.user,
                candidature.offre.entreprise
            ):

                return Response(
                    {
                        'detail':
                            'Vous ne pouvez pas gérer cette candidature.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = CandidatureStatutSerializer(
                candidature,
                data=request.data,
                partial=True
            )

            serializer.is_valid(
                raise_exception=True
            )

            candidature = serializer.save()

            if candidature.statut in [
                'Acceptée',
                'Refusée'
            ]:

                candidature.dateDecision = timezone.now()
                candidature.save(
                    update_fields=[
                        'dateDecision',
                        'dateModification'
                    ]
                )

            return Response(
                CandidatureSerializer(
                    candidature,
                    context={'request': request}
                ).data
            )

        if est_administrateur(request.user):

            return super().update(
                request,
                *args,
                **kwargs
            )

        return Response(
            {
                'detail': 'Accès refusé.'
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # ----------------------------------------------------------
    # SUPPRESSION
    # ----------------------------------------------------------

    def destroy(self, request, *args, **kwargs):

        candidature = self.get_object()

        # Candidat : possibilité de retirer sa candidature
        if est_candidat(request.user):

            if candidature.candidat != request.user:

                return Response(
                    {
                        'detail': 'Accès refusé.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            candidature.statut = 'Retirée'
            candidature.save()

            return Response(
                {
                    'message':
                        'Votre candidature a été retirée.'
                },
                status=status.HTTP_200_OK
            )

        # Administrateur
        if est_administrateur(request.user):

            candidature.delete()

            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

        return Response(
            {
                'detail':
                    'Vous n’avez pas l’autorisation.'
            },
            status=status.HTTP_403_FORBIDDEN
        )


# ==============================================================
# DOCUMENTS
# ==============================================================

class DocumentViewSet(viewsets.ModelViewSet):

    serializer_class = DocumentSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        user = self.request.user

        if est_administrateur(user):

            return Document.objects.all()

        if est_candidat(user):

            return Document.objects.filter(
                candidature__candidat=user
            )

        if est_recruteur(user):

            entreprises = user.profil.entreprises.all()

            return Document.objects.filter(
                candidature__offre__entreprise__in=entreprises
            ).distinct()

        return Document.objects.none()

    def create(self, request, *args, **kwargs):

        candidature_id = request.data.get(
            'candidature'
        )

        if not candidature_id:

            return Response(
                {
                    'candidature':
                        'La candidature est obligatoire.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            candidature = Candidature.objects.get(
                id=candidature_id
            )

        except Candidature.DoesNotExist:

            return Response(
                {
                    'candidature':
                        'Candidature introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Seul le candidat concerné peut ajouter
        # un document

        if candidature.candidat != request.user:

            if not est_administrateur(request.user):

                return Response(
                    {
                        'detail':
                            'Vous ne pouvez pas ajouter ce document.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            candidature=candidature
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# ==============================================================
# ENTRETIENS
# ==============================================================

class EntretienViewSet(viewsets.ModelViewSet):

    serializer_class = EntretienSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    # ----------------------------------------------------------
    # LISTE
    # ----------------------------------------------------------

    def get_queryset(self):

        user = self.request.user

        if est_administrateur(user):

            return Entretien.objects.select_related(
                'recruteur',
                'candidature',
                'candidature__candidat',
                'candidature__offre',
                'candidature__offre__entreprise'
            )

        # Candidat :
        # uniquement ses propres entretiens

        if est_candidat(user):

            return Entretien.objects.filter(
                candidature__candidat=user
            ).select_related(
                'recruteur',
                'candidature',
                'candidature__offre'
            )

        # Recruteur :
        # entretiens des entreprises auxquelles
        # il appartient

        if est_recruteur(user):

            entreprises = user.profil.entreprises.all()

            return Entretien.objects.filter(
                candidature__offre__entreprise__in=entreprises
            ).select_related(
                'recruteur',
                'candidature',
                'candidature__candidat',
                'candidature__offre'
            ).distinct()

        return Entretien.objects.none()

    # ----------------------------------------------------------
    # CREATION
    # ----------------------------------------------------------

    def create(self, request, *args, **kwargs):

        if not est_recruteur(request.user):

            return Response(
                {
                    'detail':
                        'Seul un recruteur peut planifier un entretien.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        candidature_id = request.data.get(
            'candidature'
        )

        if not candidature_id:

            return Response(
                {
                    'candidature':
                        'La candidature est obligatoire.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            candidature = Candidature.objects.select_related(
                'offre',
                'offre__entreprise'
            ).get(
                id=candidature_id
            )

        except Candidature.DoesNotExist:

            return Response(
                {
                    'candidature':
                        'Candidature introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ------------------------------------------------------
        # VERIFICATION ENTREPRISE
        # ------------------------------------------------------

        if not recruteur_de_l_entreprise(
            request.user,
            candidature.offre.entreprise
        ):

            return Response(
                {
                    'detail':
                        'Vous n’êtes pas recruteur de '
                        'l’entreprise concernée par cette offre.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Une candidature refusée ou retirée
        # ne peut pas recevoir d'entretien

        if candidature.statut in [
            'Refusée',
            'Retirée',
            'Acceptée'
        ]:

            return Response(
                {
                    'detail':
                        'Cette candidature ne peut plus recevoir '
                        'de nouvel entretien.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        entretien = serializer.save(
            recruteur=request.user,
            candidature=candidature
        )

        # Passage automatique au statut Entretien

        candidature.statut = 'Entretien'
        candidature.save()

        return Response(
            EntretienSerializer(
                entretien,
                context={'request': request}
            ).data,
            status=status.HTTP_201_CREATED
        )

    # ----------------------------------------------------------
    # MODIFICATION
    # ----------------------------------------------------------

    def update(self, request, *args, **kwargs):

        entretien = self.get_object()

        user = request.user

        # Administrateur
        if est_administrateur(user):

            return super().update(
                request,
                *args,
                **kwargs
            )

        # Candidat :
        # il peut uniquement répondre à l'entretien

        if est_candidat(user):

            if entretien.candidature.candidat != user:

                return Response(
                    {
                        'detail':
                            'Vous ne pouvez pas modifier cet entretien.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            allowed_data = {}

            if 'reponseCandidat' in request.data:

                allowed_data[
                    'reponseCandidat'
                ] = request.data[
                    'reponseCandidat'
                ]

            serializer = EntretienSerializer(
                entretien,
                data=allowed_data,
                partial=True
            )

            serializer.is_valid(
                raise_exception=True
            )

            serializer.save()

            return Response(
                serializer.data
            )

        # Recruteur

        if est_recruteur(user):

            if not recruteur_de_l_entreprise(
                user,
                entretien.candidature.offre.entreprise
            ):

                return Response(
                    {
                        'detail':
                            'Vous ne pouvez pas modifier cet entretien.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = EntretienSerializer(
                entretien,
                data=request.data,
                partial=True
            )

            serializer.is_valid(
                raise_exception=True
            )

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            {
                'detail':
                    'Accès refusé.'
            },
            status=status.HTTP_403_FORBIDDEN
        )