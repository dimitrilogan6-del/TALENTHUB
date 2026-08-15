import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  CandidatDashboardService,
  CandidatDashboard,
  CandidatureRecente
} from '../../../services/candidat-dashboard.service';

import {
  AuthService
} from '../../../services/connexion';


@Component({
  selector: 'app-candidat-dashboard',

  templateUrl:
    './candidat-dashboard.html',

  styleUrls: [
    './candidat-dashboard.css'
  ],

  standalone: false
})
export class CandidatDashboardComponent
  implements OnInit {


  // ==========================================================
  // DONNÉES
  // ==========================================================

  dashboard: CandidatDashboard | null = null;

  candidatures: CandidatureRecente[] = [];


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = true;

  errorMessage = '';


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
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    console.log(
      '======================================'
    );

    console.log(
      'CandidatDashboardComponent initialisé'
    );

    console.log(
      '======================================'
    );

    this.loadDashboard();

  }


  // ==========================================================
  // CHARGER LE DASHBOARD
  // ==========================================================

  loadDashboard(): void {

    console.log(
      'Chargement du dashboard...'
    );


    // --------------------------------------------------------
    // ÉTAT INITIAL
    // --------------------------------------------------------

    this.isLoading = true;

    this.errorMessage = '';

    this.dashboard = null;

    this.candidatures = [];


    // Forcer l'affichage du chargement

    this.cdr.detectChanges();


    // --------------------------------------------------------
    // APPEL API
    // --------------------------------------------------------

    this.dashboardService
      .getDashboard()
      .subscribe({

        // ====================================================
        // SUCCÈS
        // ====================================================

        next: (
          data: CandidatDashboard
        ) => {

          console.log(
            '======================================'
          );

          console.log(
            'Dashboard reçu depuis API :'
          );

          console.log(
            data
          );

          console.log(
            '======================================'
          );


          // --------------------------------------------------
          // VÉRIFICATION
          // --------------------------------------------------

          if (!data) {

            console.error(
              'Le serveur a retourné une réponse vide.'
            );

            this.errorMessage =
              'Les données du tableau de bord sont introuvables.';

            this.isLoading = false;

            this.cdr.detectChanges();

            return;

          }


          // --------------------------------------------------
          // STOCKER LE DASHBOARD
          // --------------------------------------------------

          this.dashboard = data;


          // --------------------------------------------------
          // CANDIDATURES
          // --------------------------------------------------

          this.candidatures =
            data.candidatures_recentes || [];


          console.log(
            'Dashboard stocké :',
            this.dashboard
          );

          console.log(
            'Candidatures :',
            this.candidatures
          );


          // --------------------------------------------------
          // TERMINER LE CHARGEMENT
          // --------------------------------------------------

          this.isLoading = false;

          this.errorMessage = '';


          console.log(
            'isLoading =',
            this.isLoading
          );

          console.log(
            'dashboard =',
            this.dashboard
          );


          // --------------------------------------------------
          // FORCER ANGULAR À RAFRAÎCHIR
          // --------------------------------------------------

          this.cdr.detectChanges();


          console.log(
            'Affichage du dashboard terminé.'
          );

        },


        // ====================================================
        // ERREUR
        // ====================================================

        error: (
          error: any
        ) => {

          console.error(
            '======================================'
          );

          console.error(
            'ERREUR DASHBOARD'
          );

          console.error(
            error
          );

          console.error(
            'Status :',
            error?.status
          );

          console.error(
            'Message :',
            error?.message
          );

          console.error(
            '======================================'
          );


          // --------------------------------------------------
          // TERMINER LE CHARGEMENT
          // --------------------------------------------------

          this.isLoading = false;


          // --------------------------------------------------
          // CAS NON AUTHENTIFIÉ
          // --------------------------------------------------

          if (
            error?.status === 401
          ) {

            console.warn(
              'Utilisateur non authentifié.'
            );


            this.auth.logout();


            this.cdr.detectChanges();


            this.router.navigate([
              '/login'
            ]);


            return;

          }


          // --------------------------------------------------
          // AUTRES ERREURS
          // --------------------------------------------------

          if (
            error?.status === 403
          ) {

            this.errorMessage =
              'Vous n’avez pas l’autorisation d’accéder à ce tableau de bord.';

          }

          else if (
            error?.status === 404
          ) {

            this.errorMessage =
              'Le tableau de bord est introuvable.';

          }

          else if (
            error?.status === 0
          ) {

            this.errorMessage =
              'Impossible de contacter le serveur. Vérifiez que Django est démarré.';

          }

          else {

            this.errorMessage =
              'Impossible de charger votre tableau de bord.';

          }


          // --------------------------------------------------
          // VIDER LES DONNÉES
          // --------------------------------------------------

          this.dashboard = null;

          this.candidatures = [];


          // --------------------------------------------------
          // RAFRAÎCHIR ANGULAR
          // --------------------------------------------------

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // STATUT CANDIDATURE
  // ==========================================================

  getStatutLabel(
    statut: string
  ): string {

    switch (statut) {

      case 'En attente':

        return 'En attente';


      case 'Présélectionnée':

        return 'Présélectionnée';


      case 'Entretien':

        return 'Entretien';


      case 'Acceptée':

        return 'Acceptée';


      case 'Refusée':

        return 'Refusée';


      case 'Retirée':

        return 'Retirée';


      default:

        return statut;

    }

  }


  // ==========================================================
  // CLASSE STATUT
  // ==========================================================

  getStatutClass(
    statut: string
  ): string {

    switch (statut) {

      case 'En attente':

        return 'pending';


      case 'Présélectionnée':

        return 'selected';


      case 'Entretien':

        return 'interview';


      case 'Acceptée':

        return 'accepted';


      case 'Refusée':

        return 'rejected';


      case 'Retirée':

        return 'withdrawn';


      default:

        return '';

    }

  }


  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  logout(): void {

    console.log(
      'Déconnexion...'
    );


    this.auth.logout();


    this.router.navigate([
      '/login'
    ]);

  }

}