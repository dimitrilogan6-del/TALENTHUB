import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  MissionService,
  Mission,
  CandidatureMission
} from '../../../services/mission.service';


@Component({
  selector: 'app-mission-detail',

  templateUrl: './mission-detail.html',

  styleUrls: [
    './mission-detail.css'
  ],

  standalone: false
})
export class MissionDetailComponent
  implements OnInit {


  // ==========================================================
  // MISSION
  // ==========================================================

  mission: Mission | null = null;


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = true;

  errorMessage = '';

  isSubmitting = false;


  // ==========================================================
  // CANDIDATURE
  // ==========================================================

  candidatures: CandidatureMission[] = [];

  candidatureExiste = false;

  showFormulaire = false;

  candidatureSuccess = '';

  candidatureError = '';


  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  proposition = '';

  montantPropose: number | null = null;

  delaiPropose: number | null = null;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private route: ActivatedRoute,

    private router: Router,

    private missionService: MissionService,

    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {

      this.errorMessage =
        'Identifiant de mission invalide.';

      this.isLoading = false;

      return;
    }

    this.chargerMission(id);

    this.chargerCandidatures(id);
  }


  // ==========================================================
  // CHARGER MISSION
  // ==========================================================

  chargerMission(id: number): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.missionService
      .getMission(id)
      .subscribe({

        next: (mission) => {

          console.log(
            'MISSION DETAIL :',
            mission
          );

          this.mission = mission;

          this.montantPropose =
            mission.budgetMin;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERREUR MISSION DETAIL :',
            error
          );

          this.isLoading = false;

          if (error.status === 404) {

            this.errorMessage =
              'Cette mission n’existe pas ou n’est plus disponible.';

          }
          else if (error.status === 401) {

            this.errorMessage =
              'Votre session a expiré. Veuillez vous reconnecter.';

          }
          else {

            this.errorMessage =
              'Impossible de récupérer les détails de cette mission.';

          }

          this.cdr.detectChanges();
        }

      });
  }


  // ==========================================================
  // CHARGER CANDIDATURES
  // ==========================================================

  chargerCandidatures(
    missionId: number
  ): void {

    this.missionService
      .getMesCandidatures()
      .subscribe({

        next: (response: any) => {

          let candidatures: CandidatureMission[] = [];

          if (Array.isArray(response)) {

            candidatures = response;

          }
          else if (
            Array.isArray(response?.results)
          ) {

            candidatures =
              response.results;

          }

          this.candidatures =
            candidatures;

          this.candidatureExiste =
            candidatures.some(
              candidature =>
                candidature.mission?.id ===
                missionId
            );

          console.log(
            'CANDIDATURE EXISTANTE :',
            this.candidatureExiste
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERREUR CANDIDATURES :',
            error
          );

        }

      });
  }


  // ==========================================================
  // OUVRIR FORMULAIRE
  // ==========================================================

  ouvrirFormulaire(): void {

    if (!this.mission) {
      return;
    }

    if (this.candidatureExiste) {

      this.candidatureError =
        'Vous avez déjà postulé à cette mission.';

      return;
    }

    this.candidatureSuccess = '';

    this.candidatureError = '';

    this.proposition = '';

    this.montantPropose =
      this.mission.budgetMin;

    this.delaiPropose = null;

    this.showFormulaire = true;

    this.cdr.detectChanges();
  }


  // ==========================================================
  // FERMER FORMULAIRE
  // ==========================================================

  fermerFormulaire(): void {

    if (this.isSubmitting) {
      return;
    }

    this.showFormulaire = false;

    this.candidatureError = '';

    this.candidatureSuccess = '';
  }


  // ==========================================================
  // ENVOYER CANDIDATURE
  // ==========================================================

  envoyerCandidature(): void {

    if (!this.mission) {
      return;
    }

    if (this.candidatureExiste) {

      this.candidatureError =
        'Vous avez déjà postulé à cette mission.';

      return;
    }

    this.isSubmitting = true;

    this.candidatureError = '';

    this.candidatureSuccess = '';


    this.missionService
      .postuler({

        mission:
          this.mission.id,

        proposition:
          this.proposition.trim() ||
          undefined,

        montantPropose:
          this.montantPropose,

        devise:
          this.mission.deviseBudget,

        delaiPropose:
          this.delaiPropose

      })
      .subscribe({

        next: (candidature) => {

          console.log(
            'CANDIDATURE ENVOYÉE :',
            candidature
          );

          this.candidatures = [
            candidature,
            ...this.candidatures
          ];

          this.candidatureExiste = true;

          this.candidatureSuccess =
            'Votre candidature a été envoyée avec succès.';

          this.isSubmitting = false;

          if (this.mission) {

            this.mission = {

              ...this.mission,

              nombreCandidats:
                (this.mission.nombreCandidats || 0) + 1

            };
          }

          this.cdr.detectChanges();

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

            this.candidatureError =
              error.error.detail;

          }
          else {

            this.candidatureError =
              'Impossible d’envoyer votre candidature.';

          }

          this.cdr.detectChanges();
        }

      });
  }


  // ==========================================================
  // RETOUR
  // ==========================================================

  retourMissions(): void {

    this.router.navigate([
      '/freelance/missions'
    ]);

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

    return labels[type] || type;
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

    return labels[mode] || mode;
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


    if (min !== null) {

      return `À partir de ${this.formatNumber(min)} ${mission.deviseBudget}`;

    }


    if (max !== null) {

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

}