import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CandidatureMissionService,
  CandidatureMission
} from '../../../services/candidature-mission.service';


@Component({
  selector: 'app-candidatures-missions',
  standalone: false,
  templateUrl: './candidatures-missions.html',
  styleUrl: './candidatures-missions.css'
})
export class CandidaturesMissions implements OnInit {


  // ==========================================================
  // DONNÉES
  // ==========================================================

  candidatures: CandidatureMission[] = [];

  candidatureSelectionnee:
    CandidatureMission | null = null;


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = false;

  isProcessing = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // MODAL
  // ==========================================================

  showDetailModal = false;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private candidatureService:
      CandidatureMissionService,

    private cdr:
      ChangeDetectorRef
  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.chargerCandidatures();

  }


  // ==========================================================
  // CHARGER LES CANDIDATURES
  // ==========================================================

  chargerCandidatures(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.candidatureService
      .getCandidatures()
      .subscribe({

        next: (
          data: CandidatureMission[]
        ) => {

          /*
           * Création d'une nouvelle référence
           * du tableau.
           */
          this.candidatures = [
            ...data
          ];

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
  // VOIR LE DÉTAIL
  // ==========================================================

  voirCandidature(
    candidature: CandidatureMission
  ): void {

    this.candidatureSelectionnee =
      candidature;

    this.errorMessage = '';

    this.showDetailModal = true;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER LE DÉTAIL
  // ==========================================================

  fermerDetail(): void {

    this.showDetailModal = false;

    this.candidatureSelectionnee = null;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // ACCEPTER UNE CANDIDATURE
  // ==========================================================

  accepter(
    candidature: CandidatureMission
  ): void {

    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.errorMessage = '';

    this.candidatureService
      .accepter(candidature.id)
      .subscribe({

        next: (
          response: any
        ) => {

          /*
           * Mise à jour immuable de la candidature.
           */
          this.candidatures =
            this.candidatures.map(
              c =>
                c.id === candidature.id
                  ? {
                      ...c,
                      statut: 'acceptee'
                    }
                  : c
            );

          /*
           * Mise à jour également
           * de la candidature sélectionnée.
           */
          if (
            this.candidatureSelectionnee &&
            this.candidatureSelectionnee.id ===
              candidature.id
          ) {

            this.candidatureSelectionnee = {
              ...this.candidatureSelectionnee,
              statut: 'acceptee'
            };

          }

          this.isProcessing = false;

          this.cdr.detectChanges();

          this.fermerDetail();

          this.afficherSucces(
            'Candidature acceptée avec succès.'
          );

        },

        error: (error) => {

          console.error(
            'Erreur acceptation candidature :',
            error
          );

          this.isProcessing = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // REFUSER UNE CANDIDATURE
  // ==========================================================

  refuser(
    candidature: CandidatureMission
  ): void {

    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.errorMessage = '';

    this.candidatureService
      .refuser(candidature.id)
      .subscribe({

        next: (
          response: any
        ) => {

          /*
           * Mise à jour immuable.
           */
          this.candidatures =
            this.candidatures.map(
              c =>
                c.id === candidature.id
                  ? {
                      ...c,
                      statut: 'refusee'
                    }
                  : c
            );

          /*
           * Mise à jour du détail.
           */
          if (
            this.candidatureSelectionnee &&
            this.candidatureSelectionnee.id ===
              candidature.id
          ) {

            this.candidatureSelectionnee = {
              ...this.candidatureSelectionnee,
              statut: 'refusee'
            };

          }

          this.isProcessing = false;

          this.cdr.detectChanges();

          this.fermerDetail();

          this.afficherSucces(
            'Candidature refusée.'
          );

        },

        error: (error) => {

          console.error(
            'Erreur refus candidature :',
            error
          );

          this.isProcessing = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // LABEL STATUT
  // ==========================================================

  getStatutLabel(
    statut: string
  ): string {

    const labels: {
      [key: string]: string
    } = {

      envoyee:
        'Envoyée',

      en_examen:
        'En examen',

      acceptee:
        'Acceptée',

      refusee:
        'Refusée',

      retiree:
        'Retirée'

    };

    return (
      labels[statut] ||
      statut
    );

  }


  // ==========================================================
  // MESSAGE DE SUCCÈS
  // ==========================================================

  afficherSucces(
    message: string
  ): void {

    this.successMessage = message;

    this.cdr.detectChanges();

    setTimeout(() => {

      this.successMessage = '';

      this.cdr.detectChanges();

    }, 4000);

  }


  // ==========================================================
  // MESSAGE D'ERREUR
  // ==========================================================

  getErrorMessage(
    error: any
  ): string {

    /*
     * Erreur DRF :
     * {"detail": "..."}
     */
    if (
      error?.error?.detail
    ) {

      return error.error.detail;

    }


    /*
     * Erreurs de validation DRF :
     * {
     *   "champ": ["Erreur"]
     * }
     */
    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      const values =
        Object.values(
          error.error
        );

      if (values.length) {

        const firstValue =
          values[0];

        if (
          Array.isArray(firstValue)
        ) {

          return String(
            firstValue[0]
          );

        }

        if (
          typeof firstValue === 'object' &&
          firstValue !== null
        ) {

          return JSON.stringify(
            firstValue
          );

        }

        return String(
          firstValue
        );

      }

    }


    /*
     * Erreur Angular/HTTP.
     */
    if (
      error?.message
    ) {

      return error.message;

    }


    return (
      'Une erreur est survenue.'
    );

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByCandidature(
    index: number,
    candidature: CandidatureMission
  ): number {

    return candidature.id;

  }

}
