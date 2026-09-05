import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  CandidatDashboard,
  CandidatDashboardService
} from '../../services/candidat-dashboard.service';

import {
  AuthService
} from '../../services/auth';


@Component({

  selector: 'app-candidat-layout',

  templateUrl: './candidat-layout.html',

  styleUrls: ['./candidat-layout.css'],

  standalone: false

})
export class CandidatLayoutComponent
implements OnInit, OnDestroy {


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  dashboard: CandidatDashboard | null = null;


  // ==========================================================
  // COMPTEURS
  // ==========================================================

  totalCandidatures = 0;

  messagesNonLus = 0;

  notificationsNonLues = 0;


  // ==========================================================
  // PROFIL
  // ==========================================================

  nomComplet = 'Utilisateur';

  photoProfil: string | null = null;

  initialeUtilisateur = 'U';


  // ==========================================================
  // MODE SOMBRE
  // ==========================================================

  darkMode = false;


  // ==========================================================
  // ÉTAT
  // ==========================================================

  isLoading = true;

  errorMessage = '';


  // ==========================================================
  // SUBSCRIPTIONS
  // ==========================================================

  private subscriptions: Subscription[] = [];


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(

    private dashboardService:
      CandidatDashboardService,

    private auth:
      AuthService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef

  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadDarkMode();

    this.loadDashboard();

  }


  // ==========================================================
  // CHARGEMENT DASHBOARD
  // ==========================================================

  loadDashboard(): void {

    this.isLoading = true;

    this.errorMessage = '';


    const sub =
      this.dashboardService
        .getDashboard()
        .subscribe({

          // ==================================================
          // SUCCÈS
          // ==================================================

          next: (data) => {

            console.log(
              'Dashboard candidat :',
              data
            );


            this.dashboard = data;


            // ================================================
            // CANDIDATURES
            // ================================================

            this.totalCandidatures =
              data.statistiques
                ?.total_candidatures || 0;


            // ================================================
            // MESSAGES
            // ================================================

            this.messagesNonLus =
              data.statistiques
                ?.messages_non_lus || 0;


            // ================================================
            // NOTIFICATIONS
            // ================================================

            this.notificationsNonLues =
              data.statistiques
                ?.notifications_non_lues || 0;


            // ================================================
            // NOM COMPLET
            // ================================================

            this.nomComplet =
              data.utilisateur?.nom_complet
              ||
              (
                `${data.utilisateur?.prenom || ''} ` +
                `${data.utilisateur?.nom || ''}`
              ).trim()
              ||
              data.utilisateur?.username
              ||
              'Utilisateur';


            // ================================================
            // PHOTO
            // ================================================

            this.photoProfil =
              data.profil?.photoProfil
              || null;


            // ================================================
            // INITIALE
            // ================================================

            const prenom =
              data.utilisateur?.prenom
              ||
              data.utilisateur?.username
              ||
              'U';


            this.initialeUtilisateur =
              prenom
                .charAt(0)
                .toUpperCase();


            // ================================================
            // FIN CHARGEMENT
            // ================================================

            this.isLoading = false;


            // ================================================
            // DÉTECTION ANGULAR
            // ================================================

            this.cdr.detectChanges();


            // ================================================
            // LOGS
            // ================================================

            console.log(
              'Candidatures :',
              this.totalCandidatures
            );

            console.log(
              'Messages non lus :',
              this.messagesNonLus
            );

            console.log(
              'Notifications non lues :',
              this.notificationsNonLues
            );

            console.log(
              'Photo :',
              this.photoProfil
            );

          },


          // ==================================================
          // ERREUR
          // ==================================================

          error: (error) => {

            console.error(
              'Erreur dashboard candidat :',
              error
            );


            this.isLoading = false;


            // ================================================
            // NON AUTHENTIFIÉ
            // ================================================

            if (error.status === 401) {

              this.auth.logout();

              this.router.navigate([
                '/login'
              ]);

              return;

            }


            // ================================================
            // AUTRE ERREUR
            // ================================================

            this.errorMessage =
              'Impossible de charger votre tableau de bord.';


            this.cdr.detectChanges();

          }

        });


    this.subscriptions.push(sub);

  }


  // ==========================================================
  // MODE SOMBRE
  // ==========================================================

  toggleDarkMode(): void {

    this.darkMode =
      !this.darkMode;


    this.applyDarkMode();


    localStorage.setItem(
      'talenthub-dark-mode',
      String(this.darkMode)
    );

  }


  // ==========================================================
  // APPLIQUER LE MODE
  // ==========================================================

  private applyDarkMode(): void {

    document.body.classList.toggle(
      'dark-mode',
      this.darkMode
    );

  }


  // ==========================================================
  // CHARGER MODE SOMBRE
  // ==========================================================

  private loadDarkMode(): void {

    const saved =
      localStorage.getItem(
        'talenthub-dark-mode'
      );


    this.darkMode =
      saved === 'true';


    this.applyDarkMode();

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
  // RAFRAÎCHIR DASHBOARD
  // ==========================================================

  refreshDashboard(): void {

    this.loadDashboard();

  }


  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  logout(): void {

    this.auth.logout();


    document.body.classList.remove(
      'dark-mode'
    );


    localStorage.removeItem(
      'talenthub-dark-mode'
    );


    this.router.navigate([
      '/login'
    ]);

  }


  // ==========================================================
  // DESTROY
  // ==========================================================

  ngOnDestroy(): void {

    this.subscriptions.forEach(
      subscription =>
        subscription.unsubscribe()
    );

  }

}