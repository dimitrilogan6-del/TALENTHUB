from decimal import Decimal

from app_users.models import Profil
from app_candidatures.models import Candidature


# ============================================================
# VALEUR DES NIVEAUX
# ============================================================

NIVEAUX = {
    "debutant": 1,
    "intermediaire": 2,
    "avance": 3,
    "expert": 4,
}


# ============================================================
# CALCUL DU MATCHING
# ============================================================

def calculer_matching(candidature):

    offre = candidature.offre

    candidat_user = candidature.candidat

    try:

        profil = candidat_user.profil

    except Profil.DoesNotExist:

        return {
            "score": 0,
            "competences_score": 0,
            "experience_score": 0,
            "specialite_score": 0,
            "etude_score": 0,
            "profil_score": 0,
            "competences_correspondantes": [],
            "competences_manquantes": [],
        }

    # ========================================================
    # COMPÉTENCES DE L'OFFRE
    # ========================================================

    competences_offre = (
        offre.niveaux_competences
        .select_related("competence")
        .all()
    )

    # ========================================================
    # COMPÉTENCES DU CANDIDAT
    # ========================================================

    competences_candidat = {
        competence.nom.strip().lower():
            competence
        for competence
        in profil.competences.all()
    }

    # ========================================================
    # CALCUL COMPÉTENCES
    # ========================================================

    total_competences = competences_offre.count()

    points_competences = 0

    competences_correspondantes = []

    competences_manquantes = []

    if total_competences > 0:

        for niveau_offre in competences_offre:

            nom = (
                niveau_offre.competence.nom
                .strip()
                .lower()
            )

            niveau_requis = NIVEAUX.get(
                niveau_offre.niveauRequis,
                1
            )

            competence_candidat = (
                competences_candidat.get(nom)
            )

            if competence_candidat:

                niveau_candidat = NIVEAUX.get(
                    competence_candidat.niveau,
                    1
                )

                ratio = min(
                    niveau_candidat / niveau_requis,
                    1
                )

                points_competences += ratio

                competences_correspondantes.append({
                    "nom":
                        niveau_offre.competence.nom,

                    "niveau_requis":
                        niveau_offre.niveauRequis,

                    "niveau_candidat":
                        competence_candidat.niveau,

                    "correspond":
                        niveau_candidat >= niveau_requis
                })

            else:

                competences_manquantes.append(
                    niveau_offre.competence.nom
                )

        competences_score = (
            points_competences
            / total_competences
        ) * 100

    else:

        competences_score = 0

    # ========================================================
    # EXPÉRIENCE
    # ========================================================

    experience = profil.anneesExperience or 0

    # On considère 5 ans comme référence maximale
    experience_score = min(
        (experience / 5) * 100,
        100
    )

    # ========================================================
    # SPÉCIALITÉ
    # ========================================================

    specialite_score = 0

    specialite = (
        profil.specialite or ""
    ).strip().lower()

    titre_offre = (
        offre.titre or ""
    ).strip().lower()

    description_offre = (
        offre.description or ""
    ).strip().lower()

    if specialite:

        if specialite in titre_offre:

            specialite_score = 100

        elif specialite in description_offre:

            specialite_score = 70

        else:

            mots_specialite = set(
                specialite.split()
            )

            mots_offre = set(
                (
                    titre_offre
                    + " "
                    + description_offre
                ).split()
            )

            intersection = (
                mots_specialite
                & mots_offre
            )

            if intersection:

                specialite_score = (
                    len(intersection)
                    / len(mots_specialite)
                ) * 100

    # ========================================================
    # NIVEAU D'ÉTUDE
    # ========================================================

    etude_score = 0

    if profil.niveauEtude:

        etude_score = 100

    # ========================================================
    # PROFIL
    # ========================================================

    profil_score = profil.profile_completion

    # ========================================================
    # SCORE FINAL
    # ========================================================

    score = (

        (competences_score * 0.50)

        + (experience_score * 0.20)

        + (specialite_score * 0.15)

        + (etude_score * 0.10)

        + (profil_score * 0.05)

    )

    score = round(
        min(score, 100),
        2
    )

    return {

        "score":
            score,

        "competences_score":
            round(competences_score, 2),

        "experience_score":
            round(experience_score, 2),

        "specialite_score":
            round(specialite_score, 2),

        "etude_score":
            round(etude_score, 2),

        "profil_score":
            round(profil_score, 2),

        "competences_correspondantes":
            competences_correspondantes,

        "competences_manquantes":
            competences_manquantes,
    }