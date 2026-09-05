import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  MissionService,
  Mission,
  CandidatureMission
} from '../../../services/mission.service';


@Component({
  selector: 'app-missions',

  templateUrl: './missions.html',

  styleUrls: [
    './missions.css'
  ],

  standalone: false
})
export class MissionsComponent
  implements OnInit {


  // ==========================================================
  // DONNÉES
  // ==========================================================

  missions: Mission[] = [];

  candidatures: CandidatureMission[] = [];

  missionsFiltrees: Mission[] = [];


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = true;

  isLoadingCandidatures = true;

  errorMessage = '';

  candidatureError = '';


  // ==========================================================
  // RECHERCHE
  // ==========================================================

  searchTerm = '';


  // ==========================================================
  // FILTRES
  // ==========================================================

  filtreType = 'tous';

  filtreMode = 'tous';

  filtreDomaine = 'tous';


  // ==========================================================
  // MISSION SÉLECTIONNÉE
  // ==========================================================

  missionSelectionnee: Mission | null = null;


  // ==========================================================
  // MODALE CANDIDATURE
  // ==========================================================

  showCandidatureModal = false;

  isSubmitting = false;

  candidatureSuccess = '';

  candidatureErrorMessage = '';

  proposition = '';

  montantPropose: number | null = null;

  delaiPropose: number | null = null;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private missionService: MissionService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.loadMissions();

    this.loadCandidatures();

  }


  // ==========================================================
  // CHARGER LES MISSIONS
  // ==========================================================

  loadMissions(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.missionService
      .getMissions()
      .subscribe({

        next: (response: any) => {

          console.log(
            'MISSIONS REÇUES :',
            response
          );


          /*
           * Django peut renvoyer :
           *
           * [
           *   {...},
           *   {...}
           * ]
           *
           * OU
           *
           * {
           *   count: 2,
           *   results: [...]
           * }
           */

          if (Array.isArray(response)) {

            this.missions = response;

          }
          else if (
            Array.isArray(response?.results)
          ) {

            this.missions =
              response.results;

          }
          else {

            console.warn(
              'Format missions inattendu :',
              response
            );

            this.missions = [];

          }


          this.appliquerFiltres();

          this.isLoading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'ERREUR MISSIONS :',
            error
          );

          this.missions = [];

          this.missionsFiltrees = [];

          this.isLoading = false;


          if (error.status === 401) {

            this.errorMessage =
              'Votre session a expiré. Veuillez vous reconnecter.';

          }
          else if (error.status === 403) {

            this.errorMessage =
              'Vous n’avez pas accès aux missions.';

          }
          else {

            this.errorMessage =
              'Impossible de récupérer les missions.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // CHARGER MES CANDIDATURES
  // ==========================================================

  loadCandidatures(): void {

    this.isLoadingCandidatures = true;

    this.candidatureError = '';

    this.missionService
      .getMesCandidatures()
      .subscribe({

        next: (response: any) => {

          console.log(
            'MES CANDIDATURES BRUTES :',
            response
          );


          /*
           * Gestion des deux formats possibles :
           *
           * Tableau :
           *
           * [
           *   {...}
           * ]
           *
           * Pagination DRF :
           *
           * {
           *   count: 1,
           *   results: [...]
           * }
           */

          if (Array.isArray(response)) {

            this.candidatures = response;

          }
          else if (
            Array.isArray(response?.results)
          ) {

            this.candidatures =
              response.results;

          }
          else {

            console.warn(
              'Format candidatures inattendu :',
              response
            );

            this.candidatures = [];

          }


          console.log(
            'CANDIDATURES UTILISABLES :',
            this.candidatures
          );


          this.isLoadingCandidatures = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'ERREUR CANDIDATURES :',
            error
          );


          this.candidatures = [];

          this.isLoadingCandidatures = false;

          this.candidatureError =
            'Impossible de récupérer vos candidatures.';


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // RECHERCHE
  // ==========================================================

  onSearch(): void {

    this.appliquerFiltres();

  }


  // ==========================================================
  // FILTRES
  // ==========================================================

  appliquerFiltres(): void {

    const recherche =
      (this.searchTerm || '')
        .toLowerCase()
        .trim();


    this.missionsFiltrees =
      this.missions.filter(
        (mission) => {


          // ==================================================
          // RECHERCHE
          // ==================================================

          const correspondRecherche =

            !recherche ||

            (mission.titre || '')
              .toLowerCase()
              .includes(recherche) ||

            (mission.description || '')
              .toLowerCase()
              .includes(recherche) ||

            (mission.domaine || '')
              .toLowerCase()
              .includes(recherche) ||

            (mission.localisation || '')
              .toLowerCase()
              .includes(recherche) ||

            (mission.entreprise?.nom || '')
              .toLowerCase()
              .includes(recherche) ||

            (mission.competences || [])
              .some(
                competence =>
                  (competence.nom || '')
                    .toLowerCase()
                    .includes(recherche)
              );


          // ==================================================
          // TYPE
          // ==================================================

          const correspondType =

            this.filtreType === 'tous' ||

            mission.typeMission ===
              this.filtreType;


          // ==================================================
          // MODE
          // ==================================================

          const correspondMode =

            this.filtreMode === 'tous' ||

            mission.modeTravail ===
              this.filtreMode;


          // ==================================================
          // DOMAINE
          // ==================================================

          const domaineMission =
            (mission.domaine || '')
              .trim()
              .toLowerCase();


          const domaineFiltre =
            (this.filtreDomaine || '')
              .trim()
              .toLowerCase();


          const correspondDomaine =

            this.filtreDomaine === 'tous' ||

            domaineMission ===
              domaineFiltre;


          return (

            correspondRecherche &&

            correspondType &&

            correspondMode &&

            correspondDomaine

          );

        }
      );


    console.log(
      'MISSIONS FILTRÉES :',
      this.missionsFiltrees
    );

  }


  // ==========================================================
  // RÉINITIALISER
  // ==========================================================

  resetFiltres(): void {

    this.searchTerm = '';

    this.filtreType = 'tous';

    this.filtreMode = 'tous';

    this.filtreDomaine = 'tous';

    this.appliquerFiltres();

  }


  // ==========================================================
  // DOMAINES DISPONIBLES
  // ==========================================================

  get domaines(): string[] {

    const domaines =
      this.missions

        .map(
          mission =>
            mission.domaine
        )

        .filter(
          (domaine): domaine is string =>
            !!domaine &&
            domaine.trim() !== ''
        );


    return [
      ...new Set(domaines)
    ];

  }


  // ==========================================================
  // VOIR LES DÉTAILS
  // ==========================================================

  voirMission(
    mission: Mission
  ): void {

    console.log(
      'OUVERTURE MISSION :',
      mission
    );


    this.router.navigate([
      '/freelance/missions',
      mission.id
    ]);

  }


  // ==========================================================
  // FERMER DÉTAIL
  // ==========================================================

  fermerMission(): void {

    this.missionSelectionnee = null;

  }


  // ==========================================================
  // RÉCUPÉRER UNE CANDIDATURE
  // ==========================================================

  getCandidature(
    missionId: number
  ): CandidatureMission | undefined {

    if (
      !Array.isArray(this.candidatures)
    ) {

      return undefined;

    }


    return this.candidatures.find(
      candidature =>
        candidature.mission?.id ===
        missionId
    );

  }


  // ==========================================================
  // A DÉJÀ POSTULÉ ?
  // ==========================================================

  aDejaPostule(
    missionId: number
  ): boolean {

    return !!this.getCandidature(
      missionId
    );

  }


  // ==========================================================
  // OUVRIR CANDIDATURE
  // ==========================================================

  ouvrirCandidature(
    mission: Mission
  ): void {

    this.missionSelectionnee =
      mission;


    this.proposition = '';

    this.montantPropose =
      mission.budgetMin;

    this.delaiPropose = null;

    this.candidatureSuccess = '';

    this.candidatureErrorMessage = '';

    this.showCandidatureModal = true;


    this.cdr.detectChanges();

  }


  // ==========================================================
  // FERMER CANDIDATURE
  // ==========================================================

  fermerCandidature(): void {

    if (this.isSubmitting) {

      return;

    }


    this.showCandidatureModal = false;

  }


  // ==========================================================
  // ENVOYER CANDIDATURE
  // ==========================================================

  envoyerCandidature(): void {

    if (
      !this.missionSelectionnee
    ) {

      return;

    }


    if (
      this.aDejaPostule(
        this.missionSelectionnee.id
      )
    ) {

      this.candidatureErrorMessage =
        'Vous avez déjà postulé à cette mission.';

      return;

    }


    this.isSubmitting = true;

    this.candidatureErrorMessage = '';

    this.candidatureSuccess = '';


    this.missionService
      .postuler({

        mission:
          this.missionSelectionnee.id,

        proposition:
          this.proposition ||
          undefined,

        montantPropose:
          this.montantPropose,

        devise:
          this.missionSelectionnee.deviseBudget,

        delaiPropose:
          this.delaiPropose

      })
      .subscribe({

        next: (candidature) => {

          console.log(
            'CANDIDATURE ENVOYÉE :',
            candidature
          );


          if (
            !Array.isArray(
              this.candidatures
            )
          ) {

            this.candidatures = [];

          }


          this.candidatures = [

            candidature,

            ...this.candidatures

          ];


          this.candidatureSuccess =
            'Votre candidature a été envoyée avec succès.';


          this.isSubmitting = false;


          if (
            this.missionSelectionnee
          ) {

            this.missionSelectionnee = {

              ...this.missionSelectionnee,

              nombreCandidats:
                (
                  this.missionSelectionnee
                    .nombreCandidats || 0
                ) + 1

            };

          }


          this.cdr.detectChanges();


          setTimeout(() => {

            this.showCandidatureModal =
              false;

            this.candidatureSuccess =
              '';

            this.cdr.detectChanges();

          }, 1800);

        },


        error: (error) => {

          console.error(
            'ERREUR CANDIDATURE :',
            error
          );


          this.isSubmitting = false;


          if (
            error.error?.detail
          ) {

            this.candidatureErrorMessage =
              error.error.detail;

          }
          else {

            this.candidatureErrorMessage =
              'Impossible d’envoyer votre candidature.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // LABEL TYPE
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


    return labels[type] ||
      type;

  }


  // ==========================================================
  // LABEL MODE
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


    return labels[mode] ||
      mode;

  }


  // ==========================================================
  // LABEL STATUT CANDIDATURE
  // ==========================================================

  getStatutCandidatureLabel(
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


    return labels[statut] ||
      statut;

  }


  // ==========================================================
  // FORMAT BUDGET
  // ==========================================================

  formatBudget(
    mission: Mission
  ): string {

    const min =
      mission.budgetMin;

    const max =
      mission.budgetMax;


    if (
      min !== null &&
      max !== null
    ) {

      return `${this.formatNumber(min)} - ${this.formatNumber(max)} ${mission.deviseBudget}`;

    }


    if (
      min !== null
    ) {

      return `À partir de ${this.formatNumber(min)} ${mission.deviseBudget}`;

    }


    if (
      max !== null
    ) {

      return `Jusqu'à ${this.formatNumber(max)} ${mission.deviseBudget}`;

    }


    return 'Budget à définir';

  }


  // ==========================================================
  // FORMAT NOMBRE
  // ==========================================================

  formatNumber(
    value: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(
    date: string | null
  ): string {

    if (!date) {

      return 'Non définie';

    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {

        day: '2-digit',

        month: 'short',

        year: 'numeric'

      }
    ).format(
      new Date(date)
    );

  }


  // ==========================================================
  // COMPTEURS
  // ==========================================================

  get nombreDisponibles(): number {

    return Array.isArray(
      this.missions
    )
      ? this.missions.length
      : 0;

  }


  get nombreCandidatures(): number {

    return Array.isArray(
      this.candidatures
    )
      ? this.candidatures.length
      : 0;

  }


  get nombreEnExamen(): number {

    if (
      !Array.isArray(
        this.candidatures
      )
    ) {

      return 0;

    }


    return this.candidatures.filter(
      candidature =>
        candidature.statut ===
        'en_examen'
    ).length;

  }


  get nombreAcceptees(): number {

    if (
      !Array.isArray(
        this.candidatures
      )
    ) {

      return 0;

    }


    return this.candidatures.filter(
      candidature =>
        candidature.statut ===
        'acceptee'
    ).length;

  }


}