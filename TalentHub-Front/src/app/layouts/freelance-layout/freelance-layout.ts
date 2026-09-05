import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  FreelanceDashboardService,
  FreelanceDashboard
} from '../../services/freelance-dashboard.service';

import {
  AuthService
} from '../../services/auth';


@Component({
  selector: 'app-freelance-layout',

  templateUrl:
    './freelance-layout.html',

  styleUrls: [
    './freelance-layout.css'
  ],

  standalone: false
})
export class FreelanceLayoutComponent
implements OnInit {


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  dashboard:
    FreelanceDashboard | null = null;


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = true;

  errorMessage = '';

  sidebarOpen = true;
  darkMode = false;

  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(

    private freelanceDashboardService:
      FreelanceDashboardService,

    private auth:
      AuthService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef

  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.loadDashboard();

  }
// ==========================================================
// MODE SOMBRE
// ==========================================================

toggleDarkMode(): void {

  this.darkMode = !this.darkMode;

  localStorage.setItem(
    'freelance_dark_mode',
    String(this.darkMode)
  );

}


// ==========================================================
// CHARGER LE MODE SOMBRE
// ==========================================================

loadDarkMode(): void {

  const savedMode =
    localStorage.getItem(
      'freelance_dark_mode'
    );

  this.darkMode =
    savedMode === 'true';

}

  // ==========================================================
  // CHARGER LES INFORMATIONS
  // ==========================================================

  loadDashboard(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.freelanceDashboardService
      .getDashboard()
      .subscribe({

        next: (data) => {

          console.log(
            'Layout freelance :',
            data
          );

          this.dashboard = data;

          this.isLoading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Erreur layout freelance :',
            error
          );

          this.isLoading = false;


          if (
            error.status === 401
          ) {

            this.router.navigate([
              '/login'
            ]);

            return;

          }


          if (
            error.status === 403
          ) {

            this.errorMessage =
              "Vous n'avez pas accès à l'espace freelance.";

          }

          else if (
            error.status === 404
          ) {

            this.errorMessage =
              "Profil freelance introuvable.";

          }

          else {

            this.errorMessage =
              "Impossible de charger votre espace freelance.";

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // NOM COMPLET
  // ==========================================================

  get nomComplet(): string {

    return (
      this.dashboard
        ?.utilisateur
        ?.nom_complet
    ) || 'Freelance';

  }


  // ==========================================================
  // PRÉNOM
  // ==========================================================

  get prenom(): string {

    return (
      this.dashboard
        ?.utilisateur
        ?.prenom
    ) || 'Freelance';

  }


  // ==========================================================
  // EMAIL
  // ==========================================================

  get email(): string {

    return (
      this.dashboard
        ?.utilisateur
        ?.email
    ) || '';

  }


  // ==========================================================
  // TITRE PROFESSIONNEL
  // ==========================================================

  get titreProfessionnel(): string {

    return (
      this.dashboard
        ?.profil
        ?.titreProfessionnel
    ) || 'Freelance';

  }


  // ==========================================================
  // PHOTO
  // ==========================================================

  get photoProfil(): string {

    return (
      this.dashboard
        ?.profil
        ?.photoProfil
    ) || 'assets/images/default-avatar.png';

  }


  // ==========================================================
  // DISPONIBILITÉ
  // ==========================================================

  get disponibilite(): boolean {

    return (
      this.dashboard
        ?.profil
        ?.disponibilite
    ) ?? false;

  }


  // ==========================================================
  // COMPLETION PROFIL
  // ==========================================================

  get profileCompletion(): number {

    return (
      this.dashboard
        ?.profil
        ?.profile_completion
    ) ?? 0;

  }


  // ==========================================================
  // MESSAGES NON LUS
  // ==========================================================

  /*
   * Ton endpoint dashboard actuel ne retourne pas encore
   * le nombre de messages non lus.
   *
   * On laisse donc cette valeur à 0 pour le moment.
   */

  get messagesNonLus(): number {

    return 0;

  }


  // ==========================================================
  // MENU MOBILE
  // ==========================================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  // ==========================================================
  // FERMER SIDEBAR
  // ==========================================================

  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  logout(): void {

    this.auth.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}