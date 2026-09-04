import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CandidaturesRecruteurService,
  Candidature,
  CandidatureStatutPayload,
  DocumentCandidature
} from '../../../services/candidatures-recruteur.service';


@Component({
  selector: 'app-candidatures-recruteur',
  standalone: false,
  templateUrl: './candidatures-recruteur.html',
  styleUrl: './candidatures-recruteur.css'
})
export class CandidaturesRecruteur
  implements OnInit {
[x: string]: any;


  // ==========================================================
  // DONNEES
  // ==========================================================

  candidatures: Candidature[] = [];

  candidaturesFiltrees: Candidature[] = [];


  // ==========================================================
  // ETAT
  // ==========================================================

  isLoading = true;

  isSaving = false;


  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // RECHERCHE / FILTRE
  // ==========================================================

  searchTerm = '';

  filtreStatut = '';


  // ==========================================================
  // MODAL DETAIL
  // ==========================================================

  showDetailModal = false;

  selectedCandidature: Candidature | null = null;


  // ==========================================================
  // MODAL STATUT
  // ==========================================================

  showStatusModal = false;

  candidatureStatut: Candidature | null = null;

  nouveauStatut:
    | 'En attente'
    | 'Présélectionnée'
    | 'Entretien'
    | 'Acceptée'
    | 'Refusée'
    | 'Retirée'
    = 'En attente';

  commentaireRecruteur = '';


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private candidaturesService:
      CandidaturesRecruteurService,

    private cdr:
      ChangeDetectorRef
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.chargerCandidatures();

  }


  // ==========================================================
  // CHARGER
  // ==========================================================

  chargerCandidatures(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.candidaturesService
      .getCandidatures()
      .subscribe({

        next: (data) => {

          console.log(
            'Candidatures recruteur :',
            data
          );

          this.candidatures = data;

          this.appliquerFiltres();

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur candidatures :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // FILTRER
  // ==========================================================

  appliquerFiltres(): void {

    const recherche =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.candidaturesFiltrees =
      this.candidatures.filter(
        candidature => {

          const candidat =
            `${candidature.candidat.first_name} ${candidature.candidat.last_name}`
              .toLowerCase();

          const username =
            candidature.candidat.username
              .toLowerCase();

          const email =
            candidature.candidat.email
              .toLowerCase();

          const offre =
            candidature.offre_detail.titre
              .toLowerCase();

          const entreprise =
            candidature.offre_detail.entreprise
              .toLowerCase();


          const correspondRecherche =
            !recherche ||
            candidat.includes(recherche) ||
            username.includes(recherche) ||
            email.includes(recherche) ||
            offre.includes(recherche) ||
            entreprise.includes(recherche);


          const correspondStatut =
            !this.filtreStatut ||
            candidature.statut ===
              this.filtreStatut;


          return (
            correspondRecherche &&
            correspondStatut
          );

        }
      );

  }


  // ==========================================================
  // RECHERCHE
  // ==========================================================

  rechercher(): void {

    this.appliquerFiltres();

  }


  // ==========================================================
  // RESET FILTRES
  // ==========================================================

  reinitialiserFiltres(): void {

    this.searchTerm = '';

    this.filtreStatut = '';

    this.appliquerFiltres();

  }


  // ==========================================================
  // DETAIL
  // ==========================================================

  voirDetail(
    candidature: Candidature
  ): void {

    this.selectedCandidature =
      candidature;

    this.showDetailModal = true;

  }


  // ==========================================================
  // FERMER DETAIL
  // ==========================================================

  fermerDetail(): void {

    this.showDetailModal = false;

    this.selectedCandidature = null;

  }


  // ==========================================================
  // OUVRIR MODIFICATION STATUT
  // ==========================================================

  ouvrirModificationStatut(
    candidature: Candidature
  ): void {

    this.candidatureStatut =
      candidature;

    this.nouveauStatut =
      candidature.statut;

    this.commentaireRecruteur =
      candidature.commentaireRecruteur || '';

    this.showStatusModal = true;

  }


  // ==========================================================
  // FERMER MODAL STATUT
  // ==========================================================

  fermerModificationStatut(): void {

    if (this.isSaving) {
      return;
    }

    this.showStatusModal = false;

    this.candidatureStatut = null;

  }


  // ==========================================================
  // ENREGISTRER STATUT
  // ==========================================================

  enregistrerStatut(): void {

    if (!this.candidatureStatut?.id) {
      return;
    }

    this.isSaving = true;

    this.errorMessage = '';


    const data:
      CandidatureStatutPayload = {

      statut:
        this.nouveauStatut,

      commentaireRecruteur:
        this.commentaireRecruteur || null

    };


    this.candidaturesService
      .modifierStatut(
        this.candidatureStatut.id,
        data
      )
      .subscribe({

        next: (candidature) => {

          const index =
            this.candidatures.findIndex(
              c =>
                c.id === candidature.id
            );


          if (index !== -1) {

            this.candidatures[index] =
              candidature;

          }


          this.appliquerFiltres();

          this.successMessage =
            'Statut de la candidature mis à jour avec succès.';

          this.isSaving = false;

          this.showStatusModal = false;

          this.candidatureStatut = null;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur modification statut :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

          this.isSaving = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // NOM CANDIDAT
  // ==========================================================

  getNomCandidat(
    candidature: Candidature
  ): string {

    const prenom =
      candidature.candidat.first_name || '';

    const nom =
      candidature.candidat.last_name || '';


    const nomComplet =
      `${prenom} ${nom}`.trim();


    return nomComplet ||
      candidature.candidat.username;

  }


  // ==========================================================
  // INITIALLES
  // ==========================================================

  getInitiales(
    candidature: Candidature
  ): string {

    const prenom =
      candidature.candidat.first_name || '';

    const nom =
      candidature.candidat.last_name || '';


    if (prenom && nom) {

      return (
        prenom.charAt(0) +
        nom.charAt(0)
      ).toUpperCase();

    }


    return candidature.candidat.username
      .substring(0, 2)
      .toUpperCase();

  }


  // ==========================================================
  // LABEL STATUT
  // ==========================================================

  getStatutLabel(
    statut: string
  ): string {

    return statut;

  }


  // ==========================================================
  // CLASSE STATUT
  // ==========================================================

  getStatutClass(
    statut: string
  ): string {

    const classes: {
      [key: string]: string
    } = {

      'En attente':
        'status-attente',

      'Présélectionnée':
        'status-preselection',

      'Entretien':
        'status-entretien',

      'Acceptée':
        'status-acceptee',

      'Refusée':
        'status-refusee',

      'Retirée':
        'status-retiree'

    };


    return classes[statut] ||
      'status-default';

  }


  // ==========================================================
  // DATE
  // ==========================================================

  formatDate(
    date: string
  ): string {

    if (!date) {
      return '-';
    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );

  }


  // ==========================================================
  // SCORE MATCHING
  // ==========================================================

  getMatchingScore(
    candidature: Candidature
  ): number | null {

    if (
      candidature.matching &&
      candidature.matching.score !== undefined
    ) {

      return candidature.matching.score;

    }

    return null;

  }


  // ==========================================================
  // CLASSE SCORE
  // ==========================================================

  getMatchingClass(score: number): string {

    if (score >= 80) {
      return 'score-excellent';
    }

    if (score >= 60) {
      return 'score-good';
    }

    if (score >= 40) {
      return 'score-average';
    }

    return 'score-low';
  }

  // ==========================================================
  // CV
  // ==========================================================

  getCV(
    candidature: Candidature
  ): DocumentCandidature | null {

    if (!candidature.documents) {
      return null;
    }


    return candidature.documents.find(
      document =>
        document.typeFichier === 'CV'
    ) || null;

  }


  // ==========================================================
  // OUVRIR DOCUMENT
  // ==========================================================

  ouvrirDocument(
    document: DocumentCandidature
  ): void {

    if (!document.contenu) {
      return;
    }


    window.open(
      document.contenu,
      '_blank'
    );

  }


  // ==========================================================
  // STATISTIQUES
  // ==========================================================

  getNombreParStatut(
    statut: string
  ): number {

    return this.candidatures.filter(
      candidature =>
        candidature.statut === statut
    ).length;

  }


  // ==========================================================
  // ACTUALISER
  // ==========================================================

  actualiser(): void {

    this.chargerCandidatures();

  }


  // ==========================================================
  // MESSAGE ERREUR
  // ==========================================================

  private getErrorMessage(
    error: any
  ): string {

    if (error?.error?.detail) {

      return error.error.detail;

    }


    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      const values =
        Object.values(error.error);


      if (values.length) {

        return values
          .map(value =>
            Array.isArray(value)
              ? value.join(', ')
              : String(value)
          )
          .join(' ');

      }

    }


    return 'Une erreur est survenue.';

  }

}