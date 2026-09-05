import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CandidatureMission,
  CandidaturesFreelances
} from '../../../services/candidatures-freelance';


@Component({
  selector: 'app-candidatures',
  standalone: false,
  templateUrl: './candidatures.html',
  styleUrls: ['./candidatures.css']
})
export class CandidaturesFreelance implements OnInit {


  // ============================================================
  // DONNÉES
  // ============================================================

  candidatures: CandidatureMission[] = [];

  candidaturesFiltrees: CandidatureMission[] = [];


  // ============================================================
  // CHARGEMENT
  // ============================================================

  isLoading = true;

  errorMessage = '';


  // ============================================================
  // RECHERCHE
  // ============================================================

  searchTerm = '';

  statutFiltre = 'toutes';


  // ============================================================
  // PAGINATION
  // ============================================================

  currentPage = 1;

  pageSize = 8;


  // ============================================================
  // CANDIDATURE SÉLECTIONNÉE
  // ============================================================

  candidatureSelectionnee: CandidatureMission | null = null;

  showDetails = false;


  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor(
    private candidaturesFreelance: CandidaturesFreelances,
    private cdr: ChangeDetectorRef
  ) {}


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.chargerCandidatures();

  }


  // ============================================================
  // CHARGER LES CANDIDATURES
  // ============================================================

  chargerCandidatures(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.cdr.detectChanges();


    this.candidaturesFreelance
      .getCandidatures()
      .subscribe({

        next: (data) => {

          console.log(
            'Candidatures reçues :',
            data
          );


          this.candidatures = Array.isArray(data)
            ? [...data]
            : [];


          this.appliquerFiltres();


          this.isLoading = false;


          // Force Angular à actualiser l'affichage
          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Erreur chargement candidatures :',
            error
          );


          this.candidatures = [];

          this.candidaturesFiltrees = [];


          this.errorMessage =
            'Impossible de récupérer vos candidatures. Veuillez réessayer.';


          this.isLoading = false;


          this.cdr.detectChanges();

        }

      });

  }


  // ============================================================
  // FILTRAGE
  // ============================================================

  appliquerFiltres(): void {

    const recherche =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.candidaturesFiltrees =
      this.candidatures.filter(
        (candidature) => {

          // ----------------------------------------------------
          // RECHERCHE PAR MISSION
          // ----------------------------------------------------

          const titre =
            candidature.mission?.titre
              ?.toLowerCase() || '';


          // ----------------------------------------------------
          // RECHERCHE PAR ENTREPRISE
          // ----------------------------------------------------

          const entreprise =
            candidature.mission
              ?.entreprise
              ?.nom
              ?.toLowerCase() || '';


          const rechercheCorrespond =
            !recherche ||
            titre.includes(recherche) ||
            entreprise.includes(recherche);


          // ----------------------------------------------------
          // FILTRE STATUT
          // ----------------------------------------------------

          const statutCorrespond =
            this.statutFiltre === 'toutes' ||
            candidature.statut === this.statutFiltre;


          return (
            rechercheCorrespond &&
            statutCorrespond
          );

        }
      );


    this.currentPage = 1;


    this.cdr.detectChanges();

  }


  // ============================================================
  // RECHERCHE
  // ============================================================

  onSearch(): void {

    this.appliquerFiltres();

  }


  // ============================================================
  // CHANGEMENT STATUT
  // ============================================================

  onStatutChange(): void {

    this.appliquerFiltres();

  }


  // ============================================================
  // RESET FILTRES
  // ============================================================

  resetFiltres(): void {

    this.searchTerm = '';

    this.statutFiltre = 'toutes';

    this.appliquerFiltres();

  }


  // ============================================================
  // PAGINATION
  // ============================================================

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.candidaturesFiltrees.length /
        this.pageSize
      )
    );

  }


  get candidaturesAffichees(): CandidatureMission[] {

    const start =
      (this.currentPage - 1) *
      this.pageSize;


    const end =
      start + this.pageSize;


    return this.candidaturesFiltrees.slice(
      start,
      end
    );

  }


  allerPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;


    this.cdr.detectChanges();

  }


  pageSuivante(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.cdr.detectChanges();

    }

  }


  pagePrecedente(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.cdr.detectChanges();

    }

  }


  get pages(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, index) => index + 1
    );

  }


  // ============================================================
  // STATISTIQUES
  // ============================================================

  get totalCandidatures(): number {

    return this.candidatures.length;

  }


  get candidaturesEnAttente(): number {

    return this.candidatures.filter(
      candidature =>
        candidature.statut === 'en_attente'
    ).length;

  }


  get candidaturesEnExamen(): number {

    return this.candidatures.filter(
      candidature =>
        candidature.statut === 'en_examen'
    ).length;

  }


  get candidaturesAcceptees(): number {

    return this.candidatures.filter(
      candidature =>
        candidature.statut === 'acceptee'
    ).length;

  }


  get candidaturesRefusees(): number {

    return this.candidatures.filter(
      candidature =>
        candidature.statut === 'refusee'
    ).length;

  }


  // ============================================================
  // LABEL STATUT
  // ============================================================

  getStatutLabel(
    statut: string
  ): string {

    switch (statut) {

      case 'en_attente':
        return 'En attente';

      case 'en_examen':
        return 'En examen';

      case 'acceptee':
        return 'Acceptée';

      case 'refusee':
        return 'Refusée';

      case 'retiree':
        return 'Retirée';

      default:
        return statut || 'Inconnu';

    }

  }


  // ============================================================
  // CLASSE STATUT
  // ============================================================

  getStatutClass(
    statut: string
  ): string {

    switch (statut) {

      case 'en_attente':
        return 'status-pending';

      case 'en_examen':
        return 'status-review';

      case 'acceptee':
        return 'status-accepted';

      case 'refusee':
        return 'status-rejected';

      case 'retiree':
        return 'status-withdrawn';

      default:
        return 'status-default';

    }

  }


  // ============================================================
  // ICÔNE STATUT
  // ============================================================

  getStatutIcon(
    statut: string
  ): string {

    switch (statut) {

      case 'en_attente':
        return 'fas fa-clock';

      case 'en_examen':
        return 'fas fa-search';

      case 'acceptee':
        return 'fas fa-check-circle';

      case 'refusee':
        return 'fas fa-times-circle';

      case 'retiree':
        return 'fas fa-undo';

      default:
        return 'fas fa-info-circle';

    }

  }


  // ============================================================
  // TYPE DE MISSION
  // ============================================================

  getTypeMissionLabel(
    type: string
  ): string {

    switch (type) {

      case 'freelance':
        return 'Freelance';

      case 'ponctuelle':
        return 'Mission ponctuelle';

      case 'longue_duree':
        return 'Longue durée';

      case 'temps_partiel':
        return 'Temps partiel';

      case 'temps_plein':
        return 'Temps plein';

      default:
        return type || 'Mission';

    }

  }


  // ============================================================
  // MODE DE TRAVAIL
  // ============================================================

  getModeTravailLabel(
    mode: string
  ): string {

    switch (mode) {

      case 'remote':
        return 'À distance';

      case 'presentiel':
        return 'Présentiel';

      case 'hybride':
        return 'Hybride';

      default:
        return mode || 'Non précisé';

    }

  }


  // ============================================================
  // FORMAT BUDGET
  // ============================================================

  formatBudget(
    candidature: CandidatureMission
  ): string {

    const mission =
      candidature.mission;


    if (
      mission?.budgetMin != null &&
      mission?.budgetMax != null
    ) {

      return `${this.formatNumber(
        mission.budgetMin
      )} - ${this.formatNumber(
        mission.budgetMax
      )} ${mission.deviseBudget || ''}`;

    }


    if (
      mission?.budgetMin != null
    ) {

      return `À partir de ${this.formatNumber(
        mission.budgetMin
      )} ${mission.deviseBudget || ''}`;

    }


    if (
      mission?.budgetMax != null
    ) {

      return `Jusqu'à ${this.formatNumber(
        mission.budgetMax
      )} ${mission.deviseBudget || ''}`;

    }


    return 'Non précisé';

  }


  // ============================================================
  // FORMAT MONTANT PROPOSÉ
  // ============================================================

  formatMontant(
    candidature: CandidatureMission
  ): string {

    if (
      candidature.montantPropose == null
    ) {

      return 'Non précisé';

    }


    return `${this.formatNumber(
      candidature.montantPropose
    )} ${candidature.devise || ''}`;

  }


  // ============================================================
  // FORMAT NOMBRE
  // ============================================================

  formatNumber(
    value: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);

  }


  // ============================================================
  // FORMAT DATE
  // ============================================================

  formatDate(
    date?: string | null
  ): string {

    if (!date) {

      return 'Non précisée';

    }


    const parsedDate =
      new Date(date);


    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return 'Non précisée';

    }


    return parsedDate.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );

  }


  // ============================================================
  // OUVRIR DÉTAILS
  // ============================================================

  ouvrirDetails(
    candidature: CandidatureMission
  ): void {

    this.candidatureSelectionnee =
      candidature;

    this.showDetails = true;


    document.body.style.overflow =
      'hidden';


    this.cdr.detectChanges();

  }


  // ============================================================
  // FERMER DÉTAILS
  // ============================================================

  fermerDetails(): void {

    this.showDetails = false;

    this.candidatureSelectionnee =
      null;


    document.body.style.overflow =
      '';


    this.cdr.detectChanges();

  }


  // ============================================================
  // INITIALE ENTREPRISE
  // ============================================================

  getInitialeEntreprise(
    candidature: CandidatureMission
  ): string {

    const nom =
      candidature.mission
        ?.entreprise
        ?.nom ||
      'E';


    return nom
      .charAt(0)
      .toUpperCase();

  }


  // ============================================================
  // RECHARGER
  // ============================================================

  recharger(): void {

    this.chargerCandidatures();

  }

}