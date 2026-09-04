import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  MissionRecruteurService,
  Mission
} from '../../../services/mission-recruteur.service';


@Component({
  selector: 'app-missions-recruteur',
  standalone: false,
  templateUrl: './missions-recruteur.html',
  styleUrl: './missions-recruteur.css'
})
export class MissionsRecruteur implements OnInit {

  // ==========================================================
  // DONNÉES
  // ==========================================================

  missions: Mission[] = [];

  missionSelectionnee: Mission | null = null;

  missionASupprimer: Mission | null = null;

  missionAfermer: Mission | null = null;


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // MODALS
  // ==========================================================

  showCreateModal = false;

  showDetailModal = false;

  showEditModal = false;

  showDeleteModal = false;

  showCloseModal = false;


  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  missionForm: FormGroup;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private fb: FormBuilder,
    private missionService: MissionRecruteurService,
    private cdr: ChangeDetectorRef
  ) {

    this.missionForm = this.fb.group({

      titre: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],

      description: [
        '',
        Validators.required
      ],

      typeMission: [
        'projet',
        Validators.required
      ],

      domaine: [
        ''
      ],

      localisation: [
        ''
      ],

      modeTravail: [
        'distance',
        Validators.required
      ],

      budgetMin: [
        null
      ],

      budgetMax: [
        null
      ],

      deviseBudget: [
        'FCFA',
        Validators.required
      ],

      dateLimite: [
        null
      ],

      dateDebut: [
        null
      ],

      dateFinPrevue: [
        null
      ],

      statut: [
        'publiee'
      ],

      entreprise: [
        null,
        Validators.required
      ]

    });

  }


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.chargerMissions();

  }


  // ==========================================================
  // CHARGER LES MISSIONS
  // ==========================================================

  chargerMissions(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.missionService
      .getMesMissions()
      .subscribe({

        next: (missions: Mission[]) => {

          /*
           * Nouvelle référence du tableau.
           * Cela garantit la détection du changement.
           */
          this.missions = [...missions];

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur chargement missions :',
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
  // OUVRIR MODAL CRÉATION
  // ==========================================================

  ouvrirModalCreation(): void {

    this.resetForm();

    this.errorMessage = '';

    this.missionSelectionnee = null;

    this.showCreateModal = true;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER MODAL CRÉATION
  // ==========================================================

  fermerModalCreation(): void {

    if (this.isSaving) {
      return;
    }

    this.showCreateModal = false;

    this.resetForm();

    this.cdr.detectChanges();

  }


  // ==========================================================
  // CRÉER UNE MISSION
  // ==========================================================

  creerMission(): void {

    if (this.isSaving) {
      return;
    }

    if (this.missionForm.invalid) {

      this.missionForm.markAllAsTouched();

      return;

    }

    this.isSaving = true;

    this.errorMessage = '';

    const data = {
      ...this.missionForm.value
    };

    console.log(
      'Données envoyées pour création :',
      data
    );

    this.missionService
      .creerMission(data)
      .subscribe({

        next: (mission: Mission) => {

          /*
           * Nouvelle référence du tableau.
           */
          this.missions = [
            mission,
            ...this.missions
          ];

          this.showCreateModal = false;

          this.isSaving = false;

          this.resetForm();

          this.cdr.detectChanges();

          this.afficherSucces(
            'Mission créée avec succès.'
          );

        },

        error: (error) => {

          console.error(
            'Erreur création mission :',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // VOIR DÉTAIL
  // ==========================================================

  voirMission(
    mission: Mission
  ): void {

    this.missionSelectionnee = mission;

    this.errorMessage = '';

    this.showDetailModal = true;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER DÉTAIL
  // ==========================================================

  fermerDetail(): void {

    this.showDetailModal = false;

    this.missionSelectionnee = null;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // OUVRIR MODIFICATION
  // ==========================================================

  ouvrirModification(
    mission: Mission
  ): void {

    this.missionSelectionnee = mission;

    this.errorMessage = '';

    this.missionForm.patchValue({

      titre:
        mission.titre ?? '',

      description:
        mission.description ?? '',

      typeMission:
        mission.typeMission ?? 'projet',

      domaine:
        mission.domaine ?? '',

      localisation:
        mission.localisation ?? '',

      modeTravail:
        mission.modeTravail ?? 'distance',

      budgetMin:
        mission.budgetMin ?? null,

      budgetMax:
        mission.budgetMax ?? null,

      deviseBudget:
        mission.deviseBudget ?? 'FCFA',

      dateLimite:
        mission.dateLimite ?? null,

      dateDebut:
        mission.dateDebut ?? null,

      dateFinPrevue:
        mission.dateFinPrevue ?? null,

      statut:
        mission.statut ?? 'publiee',

      /*
       * On conserve l'ID de l'entreprise.
       */
      entreprise:
        mission.entreprise?.id ?? null

    });

    this.showDetailModal = false;

    this.showEditModal = true;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER MODIFICATION
  // ==========================================================

  fermerModification(): void {

    if (this.isSaving) {
      return;
    }

    this.showEditModal = false;

    this.missionSelectionnee = null;

    this.resetForm();

    this.cdr.detectChanges();

  }


  // ==========================================================
  // MODIFIER UNE MISSION
  // ==========================================================

  modifierMission(): void {

    if (this.isSaving) {
      return;
    }

    if (!this.missionSelectionnee) {
      return;
    }

    if (this.missionForm.invalid) {

      this.missionForm.markAllAsTouched();

      return;

    }

    this.isSaving = true;

    this.errorMessage = '';

    const id =
      this.missionSelectionnee.id;

    const data = {
      ...this.missionForm.value
    };

    console.log(
      'Modification mission ID :',
      id
    );

    console.log(
      'Données envoyées :',
      data
    );

    this.missionService
      .modifierMission(id, data)
      .subscribe({

        next: (mission: Mission) => {

          /*
           * Création d'un nouveau tableau.
           * Évite les problèmes de détection de changement.
           */
          this.missions =
            this.missions.map(
              (ancienneMission) =>
                ancienneMission.id === id
                  ? mission
                  : ancienneMission
            );

          this.showEditModal = false;

          this.missionSelectionnee = null;

          this.isSaving = false;

          this.resetForm();

          this.cdr.detectChanges();

          this.afficherSucces(
            'Mission modifiée avec succès.'
          );

        },

        error: (error) => {

          console.error(
            'Erreur modification mission :',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // OUVRIR SUPPRESSION
  // ==========================================================

  ouvrirSuppression(
    mission: Mission
  ): void {

    this.missionASupprimer = mission;

    this.errorMessage = '';

    this.showDeleteModal = true;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER SUPPRESSION
  // ==========================================================

  fermerSuppression(): void {

    if (this.isSaving) {
      return;
    }

    this.showDeleteModal = false;

    this.missionASupprimer = null;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // SUPPRIMER UNE MISSION
  // ==========================================================

  supprimerMission(): void {

    if (this.isSaving) {
      return;
    }

    if (!this.missionASupprimer) {
      return;
    }

    const id =
      this.missionASupprimer.id;

    this.isSaving = true;

    this.errorMessage = '';

    this.missionService
      .supprimerMission(id)
      .subscribe({

        next: () => {

          /*
           * Nouvelle référence du tableau.
           */
          this.missions =
            this.missions.filter(
              mission =>
                mission.id !== id
            );

          this.showDeleteModal = false;

          this.missionASupprimer = null;

          this.isSaving = false;

          this.cdr.detectChanges();

          this.afficherSucces(
            'Mission supprimée avec succès.'
          );

        },

        error: (error) => {

          console.error(
            'Erreur suppression mission :',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // OUVRIR MODAL FERMETURE
  // ==========================================================

  ouvrirFermeture(
    mission: Mission
  ): void {

    this.missionAfermer = mission;

    this.errorMessage = '';

    this.showCloseModal = true;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER MODAL FERMETURE
  // ==========================================================

  fermerModalFermeture(): void {

    if (this.isSaving) {
      return;
    }

    this.showCloseModal = false;

    this.missionAfermer = null;

    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER UNE MISSION
  // ==========================================================

  fermerMission(): void {

    if (this.isSaving) {
      return;
    }

    if (!this.missionAfermer) {
      return;
    }

    const id =
      this.missionAfermer.id;

    this.isSaving = true;

    this.errorMessage = '';

    this.missionService
      .fermerMission(id)
      .subscribe({

        next: (mission: Mission) => {

          /*
           * Remplacement de la mission
           * par la version retournée par l'API.
           */
          this.missions =
            this.missions.map(
              ancienneMission =>
                ancienneMission.id === id
                  ? mission
                  : ancienneMission
            );

          this.showCloseModal = false;

          this.missionAfermer = null;

          this.isSaving = false;

          this.cdr.detectChanges();

          this.afficherSucces(
            'Mission fermée avec succès.'
          );

        },

        error: (error) => {

          console.error(
            'Erreur fermeture mission :',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // RESET FORMULAIRE
  // ==========================================================

  resetForm(): void {

    this.missionForm.reset({

      titre: '',

      description: '',

      typeMission: 'projet',

      domaine: '',

      localisation: '',

      modeTravail: 'distance',

      budgetMin: null,

      budgetMax: null,

      deviseBudget: 'FCFA',

      dateLimite: null,

      dateDebut: null,

      dateFinPrevue: null,

      statut: 'publiee',

      entreprise: null

    });

    this.missionForm.markAsPristine();

    this.missionForm.markAsUntouched();

  }


  // ==========================================================
  // MESSAGE SUCCÈS
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
  // MESSAGE ERREUR
  // ==========================================================

  getErrorMessage(
    error: any
  ): string {

    if (
      error?.error?.detail
    ) {

      return error.error.detail;

    }

    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      const values =
        Object.values(error.error);

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

    if (error?.message) {

      return error.message;

    }

    return 'Une erreur est survenue.';

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

      brouillon:
        'Brouillon',

      publiee:
        'Publiée',

      en_cours:
        'En cours',

      terminee:
        'Terminée',

      annulee:
        'Annulée',

      fermee:
        'Fermée'

    };

    return (
      labels[statut] ||
      statut
    );

  }


  // ==========================================================
  // LABEL TYPE MISSION
  // ==========================================================

  getTypeMissionLabel(
    type: string
  ): string {

    const labels: {
      [key: string]: string
    } = {

      ponctuelle:
        'Mission ponctuelle',

      projet:
        'Projet',

      longue_duree:
        'Longue durée',

      temps_partiel:
        'Temps partiel',

      temps_plein:
        'Temps plein'

    };

    return (
      labels[type] ||
      type
    );

  }


  // ==========================================================
  // LABEL MODE TRAVAIL
  // ==========================================================

  getModeTravailLabel(
    mode: string
  ): string {

    const labels: {
      [key: string]: string
    } = {

      sur_place:
        'Sur place',

      hybride:
        'Hybride',

      distance:
        'À distance'

    };

    return (
      labels[mode] ||
      mode
    );

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByMission(
    index: number,
    mission: Mission
  ): number {

    return mission.id;

  }

}