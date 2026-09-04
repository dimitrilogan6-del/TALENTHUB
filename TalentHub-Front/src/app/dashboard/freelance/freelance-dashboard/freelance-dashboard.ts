import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  FreelanceDashboardService,
  FreelanceDashboard,
  FreelanceStatistiques
} from '../../../services/freelance-dashboard.service';


@Component({
  selector: 'app-freelance-dashboard',

  templateUrl:
    './freelance-dashboard.html',

  styleUrls: [
    './freelance-dashboard.css'
  ],

  standalone: false
})
export class FreelanceDashboardComponent
implements OnInit {


  // ==========================================================
  // DONNÉES
  // ==========================================================

  dashboard:
    FreelanceDashboard | null = null;


  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = true;

  errorMessage = '';

  darkMode = false;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(

    private freelanceService:
      FreelanceDashboardService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.loadDarkMode();

    this.loadDashboard();

  }


  // ==========================================================
  // CHARGER DASHBOARD
  // ==========================================================

  loadDashboard(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.freelanceService
      .getDashboard()
      .subscribe({

        next: (response) => {

          console.log(
            'Dashboard Freelance :',
            response
          );

          this.dashboard =
            response;

          this.isLoading =
            false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Erreur dashboard freelance :',
            error
          );

          this.isLoading =
            false;


          if (error.status === 401) {

            this.errorMessage =
              'Votre session a expiré. Veuillez vous reconnecter.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              "Vous n'êtes pas autorisé à accéder à cet espace.";

          }

          else if (error.status === 404) {

            this.errorMessage =
              'Dashboard freelance introuvable.';

          }

          else {

            this.errorMessage =
              'Impossible de charger les données du dashboard.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // UTILISATEUR
  // ==========================================================

  get utilisateur() {

    return this.dashboard?.utilisateur;

  }


  // ==========================================================
  // PROFIL
  // ==========================================================

  get profil() {

    return this.dashboard?.profil;

  }


  // ==========================================================
  // STATISTIQUES
  // ==========================================================

  get statistiques():
    FreelanceStatistiques | null {

    return this.dashboard?.statistiques ?? null;

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
  // TITRE
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
  // PROFIL COMPLÉTION
  // ==========================================================

  get profileCompletion(): number {

    return (
      this.dashboard
        ?.profil
        ?.profile_completion
    ) ?? 0;

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
  // BIOGRAPHIE
  // ==========================================================

  get biographie(): string {

    return (
      this.dashboard
        ?.profil
        ?.biographie
    ) || 'Aucune biographie renseignée.';

  }


  // ==========================================================
  // TARIF
  // ==========================================================

  get tarifHoraire(): number {

    return (
      this.dashboard
        ?.profil
        ?.tarifHoraire
    ) ?? 0;

  }


  // ==========================================================
  // DEVISE
  // ==========================================================

  get devise(): string {

    return (
      this.dashboard
        ?.profil
        ?.deviseTarif
    ) || 'FCFA';

  }


  // ==========================================================
  // EXPÉRIENCE
  // ==========================================================

  get experience(): number {

    return (
      this.dashboard
        ?.profil
        ?.anneesExperience
    ) ?? 0;

  }


  // ==========================================================
  // SPÉCIALITÉ
  // ==========================================================

  get specialite(): string {

    return (
      this.dashboard
        ?.profil
        ?.specialite
    ) || 'Non renseignée';

  }


  // ==========================================================
  // TÉLÉPHONE
  // ==========================================================

  get telephone(): string {

    return (
      this.dashboard
        ?.profil
        ?.telephone
    ) || 'Non renseigné';

  }


  // ==========================================================
  // MISSIONS
  // ==========================================================

  get missionsTotal(): number {

    return this.statistiques
      ?.missions_total ?? 0;

  }


  get missionsEnCours(): number {

    return this.statistiques
      ?.missions_en_cours ?? 0;

  }


  get missionsTerminees(): number {

    return this.statistiques
      ?.missions_terminees ?? 0;

  }


  // ==========================================================
  // CANDIDATURES
  // ==========================================================

  get candidaturesTotal(): number {

    return this.statistiques
      ?.candidatures_total ?? 0;

  }


  get candidaturesEnAttente(): number {

    return this.statistiques
      ?.candidatures_en_attente ?? 0;

  }


  // ==========================================================
  // SERVICES
  // ==========================================================

  get servicesTotal(): number {

    return this.statistiques
      ?.services_total ?? 0;

  }


  // ==========================================================
  // REVENUS
  // ==========================================================

  get revenusTotal(): number {

    return this.statistiques
      ?.revenus_total ?? 0;

  }


  // ==========================================================
  // MESSAGES
  // ==========================================================

  get messagesNonLus(): number {

    return this.statistiques
      ?.messages_non_lus ?? 0;

  }


  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  get notificationsNonLues(): number {

    return this.statistiques
      ?.notifications_non_lues ?? 0;

  }


  // ==========================================================
  // MODE SOMBRE
  // ==========================================================

  toggleDarkMode(): void {

    this.darkMode =
      !this.darkMode;

    localStorage.setItem(
      'freelance-dark-mode',
      String(this.darkMode)
    );

  }


  // ==========================================================
  // CHARGER MODE SOMBRE
  // ==========================================================

  loadDarkMode(): void {

    const saved =
      localStorage.getItem(
        'freelance-dark-mode'
      );

    this.darkMode =
      saved === 'true';

  }


  // ==========================================================
  // FORMAT REVENUS
  // ==========================================================

  formatMoney(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(amount);

  }


}