import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Candidature,
  CandidatureService
} from '../../../services/candidature-service';


@Component({
  selector: 'app-mes-candidatures',
  templateUrl: './mes-candidatures.html',
  styleUrls: ['./mes-candidatures.css'],
  standalone: false
})
export class MesCandidaturesComponent implements OnInit {

  // ==========================================================
  // DONNÉES
  // ==========================================================

  candidatures: Candidature[] = [];

  candidaturesFiltrees: Candidature[] = [];


  // ==========================================================
  // ÉTAT
  // ==========================================================

  chargement = true;

  erreur = '';

  recherche = '';

  filtreStatut = 'Toutes';

  candidatureSelectionnee: Candidature | null = null;

  afficherDetails = false;

  retirerEnCours = false;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private candidatureService: CandidatureService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    console.log(
      'MesCandidaturesComponent initialisé'
    );

    this.chargerCandidatures();

  }


  // ==========================================================
  // CHARGER LES CANDIDATURES
  // ==========================================================

  chargerCandidatures(): void {

    console.log(
      'Chargement des candidatures...'
    );

    this.chargement = true;

    this.erreur = '';

    this.candidatureService
      .getMesCandidatures()
      .subscribe({

        next: (data: Candidature[]) => {

          console.log(
            'Candidatures reçues :',
            data
          );

          // --------------------------------------------------
          // Vérification
          // --------------------------------------------------

          if (!Array.isArray(data)) {

            console.error(
              'La réponse API n\'est pas un tableau :',
              data
            );

            this.candidatures = [];

            this.candidaturesFiltrees = [];

            this.erreur =
              'Format de données incorrect reçu depuis le serveur.';

            this.chargement = false;

            this.cdr.detectChanges();

            return;
          }


          // --------------------------------------------------
          // Stockage
          // --------------------------------------------------

          this.candidatures = [...data];


          // --------------------------------------------------
          // Filtrage initial
          // --------------------------------------------------

          this.appliquerFiltreStatut();


          // --------------------------------------------------
          // Fin chargement
          // --------------------------------------------------

          this.chargement = false;


          console.log(
            'Candidatures affichées :',
            this.candidaturesFiltrees
          );


          // --------------------------------------------------
          // Force Angular à mettre à jour le template
          // --------------------------------------------------

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Erreur chargement candidatures :',
            error
          );

          this.candidatures = [];

          this.candidaturesFiltrees = [];

          this.erreur =
            'Impossible de charger vos candidatures.';

          this.chargement = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // RECHERCHE
  // ==========================================================

  rechercher(): void {

    this.appliquerFiltreStatut();

  }


  // ==========================================================
  // FILTRE STATUT
  // ==========================================================

  filtrerParStatut(
    statut: string
  ): void {

    console.log(
      'Filtre sélectionné :',
      statut
    );

    this.filtreStatut = statut;

    this.appliquerFiltreStatut();

  }


  // ==========================================================
  // APPLICATION RECHERCHE + STATUT
  // ==========================================================

  appliquerFiltreStatut(): void {

    const recherche =
      this.recherche
        .toLowerCase()
        .trim();


    this.candidaturesFiltrees =
      this.candidatures.filter(
        candidature => {

          // --------------------------------------------------
          // Titre
          // --------------------------------------------------

          const titre =
            candidature.offre_detail?.titre
              ?.toLowerCase() || '';


          // --------------------------------------------------
          // Entreprise
          // --------------------------------------------------

          const entreprise =
            candidature.offre_detail?.entreprise
              ?.toLowerCase() || '';


          // --------------------------------------------------
          // Statut
          // --------------------------------------------------

          const statut =
            candidature.statut
              ?.toLowerCase() || '';


          // --------------------------------------------------
          // Recherche
          // --------------------------------------------------

          const correspondRecherche =
            !recherche ||
            titre.includes(recherche) ||
            entreprise.includes(recherche) ||
            statut.includes(recherche);


          // --------------------------------------------------
          // Filtre statut
          // --------------------------------------------------

          const correspondStatut =
            this.filtreStatut === 'Toutes' ||
            candidature.statut === this.filtreStatut;


          return (
            correspondRecherche &&
            correspondStatut
          );

        }
      );


    console.log(
      'Candidatures filtrées :',
      this.candidaturesFiltrees
    );


    // Sécurité supplémentaire pour l'affichage
    this.cdr.detectChanges();

  }


  // ==========================================================
  // DETAILS
  // ==========================================================

  voirDetails(
    candidature: Candidature
  ): void {

    this.candidatureSelectionnee =
      candidature;

    this.afficherDetails = true;

  }


  fermerDetails(): void {

    this.afficherDetails = false;

    this.candidatureSelectionnee = null;

  }


  // ==========================================================
  // MODIFIER
  // ==========================================================

  modifierCandidature(
    candidature: Candidature
  ): void {

    this.router.navigate([
      '/dashboard/candidat/mes-candidatures',
      candidature.id,
      'modifier'
    ]);

  }


  // ==========================================================
  // RETIRER
  // ==========================================================

  retirerCandidature(
    candidature: Candidature
  ): void {

    if (!candidature.id) {
      return;
    }


    const confirmation =
      confirm(
        'Voulez-vous vraiment retirer cette candidature ?'
      );


    if (!confirmation) {
      return;
    }


    this.retirerEnCours = true;


    this.candidatureService
      .retirerCandidature(candidature.id)
      .subscribe({

        next: () => {

          candidature.statut = 'Retirée';

          this.appliquerFiltreStatut();

          this.retirerEnCours = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Erreur retrait candidature :',
            error
          );

          this.erreur =
            'Impossible de retirer cette candidature.';

          this.retirerEnCours = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // STATISTIQUES
  // ==========================================================

  get total(): number {

    return this.candidatures.length;

  }


  get enAttente(): number {

    return this.candidatures.filter(
      c => c.statut === 'En attente'
    ).length;

  }


  get preselectionnees(): number {

    return this.candidatures.filter(
      c => c.statut === 'Présélectionnée'
    ).length;

  }


  get entretiens(): number {

    return this.candidatures.filter(
      c => c.statut === 'Entretien'
    ).length;

  }


  get acceptees(): number {

    return this.candidatures.filter(
      c => c.statut === 'Acceptée'
    ).length;

  }


  get refusees(): number {

    return this.candidatures.filter(
      c => c.statut === 'Refusée'
    ).length;

  }


  // ==========================================================
  // CLASSE DU STATUT
  // ==========================================================

  getClasseStatut(
    statut?: string
  ): string {

    switch (statut) {

      case 'En attente':
        return 'statut-attente';

      case 'Présélectionnée':
        return 'statut-preselectionnee';

      case 'Entretien':
        return 'statut-entretien';

      case 'Acceptée':
        return 'statut-acceptee';

      case 'Refusée':
        return 'statut-refusee';

      case 'Retirée':
        return 'statut-retiree';

      default:
        return '';

    }

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formaterDate(
    date?: string
  ): string {

    if (!date) {
      return '-';
    }


    const dateObj =
      new Date(date);


    if (isNaN(dateObj.getTime())) {
      return '-';
    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(
      dateObj
    );

  }


  // ==========================================================
  // FORMAT TAILLE
  // ==========================================================

  formaterTaille(
    taille: number
  ): string {

    if (!taille) {
      return '0 Ko';
    }


    if (taille < 1024) {
      return `${taille} octets`;
    }


    if (taille < 1024 * 1024) {

      return `${(
        taille / 1024
      ).toFixed(1)} Ko`;

    }


    return `${(
      taille / (1024 * 1024)
    ).toFixed(1)} Mo`;

  }

}