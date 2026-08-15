import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Freelance,
  FreelanceService
} from '../../services/freelance.service';


@Component({
  selector: 'app-freelances',
  templateUrl: './freelances.html',
  styleUrls: ['./freelances.css'],
  standalone: false
})
export class Freelances implements OnInit {

  freelances: Freelance[] = [];

  loading = true;

  errorMessage = '';


  constructor(
    private freelanceService: FreelanceService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    console.log(
      'FreelancePage initialisée'
    );

    this.loadFreelances();

  }


  // ==========================================================
  // CHARGER LES FREELANCES
  // ==========================================================

  loadFreelances(): void {

    console.log(
      'Chargement des freelances...'
    );

    this.loading = true;

    this.errorMessage = '';


    this.freelanceService
      .getFreelances()
      .subscribe({

        next: (data: Freelance[]) => {

          console.log(
            'Freelances reçus par Angular :',
            data
          );


          /*
           * Nouvelle référence du tableau.
           */
          this.freelances = [
            ...data
          ];


          this.loading = false;


          console.log(
            'Nombre de freelances :',
            this.freelances.length
          );


          /*
           * Force Angular à mettre à jour
           * l'interface immédiatement.
           */
          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Erreur lors du chargement des freelances :',
            error
          );


          this.loading = false;


          if (error.status === 401) {

            this.errorMessage =
              'Votre session a expiré. Veuillez vous reconnecter.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'Vous n’avez pas accès à cette ressource.';

          }

          else if (error.status === 0) {

            this.errorMessage =
              'Impossible de contacter le serveur Django.';

          }

          else {

            this.errorMessage =
              'Impossible de charger les freelances.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // PHOTO
  // ==========================================================

  getPhoto(
    freelance: Freelance
  ): string {

    if (
      freelance.photoProfil &&
      freelance.photoProfil.trim() !== ''
    ) {

      return freelance.photoProfil;

    }


    return 'assets/images/default-avatar.png';

  }


  // ==========================================================
  // SPÉCIALITÉ
  // ==========================================================

  getSpecialite(
    freelance: Freelance
  ): string {

    if (
      freelance.specialite &&
      freelance.specialite.trim() !== ''
    ) {

      return freelance.specialite;

    }


    if (
      freelance.titreProfessionnel &&
      freelance.titreProfessionnel.trim() !== ''
    ) {

      return freelance.titreProfessionnel;

    }


    return 'Freelance professionnel';

  }


  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  getDescription(
    freelance: Freelance
  ): string {

    if (
      freelance.biographie &&
      freelance.biographie.trim() !== ''
    ) {

      return freelance.biographie;

    }


    return 'Professionnel disponible pour vos projets.';

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByFreelance(
    index: number,
    freelance: Freelance
  ): number {

    return freelance.id;

  }

}