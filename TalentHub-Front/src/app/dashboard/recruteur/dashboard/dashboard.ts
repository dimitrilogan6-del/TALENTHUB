import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  RecruteurDashboardService,
  RecruteurDashboard,
  CandidatureMatching,
  EntretienRecruteur
} from '../../../services/recruteur-dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardRecruteur implements OnInit {

  dashboard: RecruteurDashboard | null = null;

  isLoading = true;

  errorMessage = '';

  constructor(
    private dashboardService: RecruteurDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDashboard();
  }

  // =========================================================
  // CHARGEMENT DU DASHBOARD
  // =========================================================

  chargerDashboard(): void {

    this.isLoading = true;
    this.errorMessage = '';

    // Détection immédiate pour afficher le chargement
    this.cdr.detectChanges();

    this.dashboardService.getDashboard().subscribe({

      next: (data: RecruteurDashboard) => {

        console.log('Dashboard recruteur reçu :', data);

        // On affecte les données
        this.dashboard = data;

        // On termine le chargement
        this.isLoading = false;

        console.log('Dashboard affecté :', this.dashboard);
        console.log('Statistiques :', this.dashboard.statistiques);
        console.log('Utilisateur :', this.dashboard.utilisateur);
        console.log('Entreprise :', this.dashboard.entreprise);

        // Force Angular à actualiser le HTML
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Erreur dashboard recruteur :',
          error
        );

        this.errorMessage =
          'Impossible de charger votre tableau de bord.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }

  // =========================================================
  // RACCOURCIS
  // =========================================================

  get statistiques() {
    return this.dashboard?.statistiques;
  }

  get entreprise() {
    return this.dashboard?.entreprise;
  }

  get utilisateur() {
    return this.dashboard?.utilisateur;
  }

  get profil() {
    return this.dashboard?.profil;
  }

  get topCandidats(): CandidatureMatching[] {
    return this.dashboard?.top_candidats || [];
  }

  get candidaturesRecentes(): CandidatureMatching[] {
    return this.dashboard?.candidatures_recentes || [];
  }

  get offresRecentes() {
    return this.dashboard?.offres_recentes || [];
  }

  get entretiens(): EntretienRecruteur[] {
    return this.dashboard?.entretiens || [];
  }

  // =========================================================
  // SCORE MATCHING
  // =========================================================

  getScoreClass(score: number): string {

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

  // =========================================================
  // STATUT CANDIDATURE
  // =========================================================

  getStatutClass(statut: string): string {

    switch (statut) {

      case 'Acceptée':
        return 'status-accepted';

      case 'Refusée':
        return 'status-refused';

      case 'Présélectionnée':
        return 'status-selected';

      case 'Entretien':
        return 'status-interview';

      case 'En attente':
        return 'status-pending';

      default:
        return 'status-default';
    }
  }

  // =========================================================
  // STATUT OFFRE
  // =========================================================

  getOffreStatusClass(statut: string): string {

    switch (statut) {

      case 'publiee':
        return 'status-published';

      case 'brouillon':
        return 'status-draft';

      case 'suspendue':
        return 'status-suspended';

      case 'fermee':
        return 'status-closed';

      default:
        return 'status-default';
    }
  }

  // =========================================================
  // STATUT ENTRETIEN
  // =========================================================

  getEntretienStatusClass(statut: string): string {

    switch (statut) {

      case 'Planifié':
        return 'status-pending';

      case 'Confirmé':
        return 'status-accepted';

      case 'Terminé':
        return 'status-default';

      case 'Annulé':
        return 'status-refused';

      case 'Reporté':
        return 'status-interview';

      default:
        return 'status-default';
    }
  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  formatDate(date: string | null): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  // =========================================================
  // FORMAT HEURE
  // =========================================================

  formatTime(date: string): string {

    return new Date(date).toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  // =========================================================
  // INITIALES
  // =========================================================

  getInitiales(nom: string): string {

    if (!nom) {
      return '?';
    }

    const mots = nom
      .trim()
      .split(' ')
      .filter(Boolean);

    if (mots.length >= 2) {

      return (
        mots[0][0] +
        mots[1][0]
      ).toUpperCase();
    }

    return nom
      .substring(0, 2)
      .toUpperCase();
  }

  // =========================================================
  // ACTUALISER
  // =========================================================

  actualiser(): void {
    this.chargerDashboard();
  }
}
