import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';


import {
  Entretien,
  EntretienService
} from '../../../services/entretien.service';


@Component({
  selector: 'app-entretiens',

  templateUrl:
    './entretiens.html',

  styleUrls: [
    './entretiens.css'
  ],

  standalone: false
})
export class EntretiensCandidatComponent
  implements OnInit {


  // ==========================================================
  // DONNÉES
  // ==========================================================

  entretiens: Entretien[] = [];

  entretiensFiltres: Entretien[] = [];


  // ==========================================================
  // ÉTAT
  // ==========================================================

  chargement = true;

  erreur = '';

  recherche = '';

  filtreStatut = 'Tous';

  filtreType = 'Tous';


  // ==========================================================
  // MODAL
  // ==========================================================

  entretienSelectionne:
    Entretien | null = null;

  afficherDetails = false;


  // ==========================================================
  // RÉPONSE EN COURS
  // ==========================================================

  reponseEnCours = false;


  constructor(
    private entretienService: EntretienService,
      private cdr: ChangeDetectorRef

  ) {}


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    this.chargerEntretiens();

  }


  // ==========================================================
  // CHARGER LES ENTRETIENS
  // ==========================================================

chargerEntretiens(): void {

  console.log(
    'Chargement des entretiens...'
  );

  this.chargement = true;
  this.erreur = '';

  this.entretienService
    .getMesEntretiens()
    .subscribe({

      next: (data: Entretien[]) => {

        console.log(
          'Entretiens candidat :',
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

          this.entretiens = [];
          this.entretiensFiltres = [];

          this.erreur =
            'Format de données incorrect reçu depuis le serveur.';

          this.chargement = false;

          this.cdr.detectChanges();

          return;
        }

        // --------------------------------------------------
        // STOCKAGE
        // --------------------------------------------------

        this.entretiens = [...data];

        // --------------------------------------------------
        // FILTRES PAR DÉFAUT
        // --------------------------------------------------

        this.recherche = '';
        this.filtreStatut = 'Tous';
        this.filtreType = 'Tous';

        // --------------------------------------------------
        // FILTRAGE INITIAL
        // --------------------------------------------------

        this.appliquerFiltres();

        // --------------------------------------------------
        // FIN CHARGEMENT
        // --------------------------------------------------

        this.chargement = false;

        console.log(
          'Entretiens affichés :',
          this.entretiensFiltres
        );

        console.log(
          'Nombre entretiens :',
          this.entretiens.length
        );

        console.log(
          'Nombre entretiens filtrés :',
          this.entretiensFiltres.length
        );

        // --------------------------------------------------
        // FORCE ANGULAR À RAFRAÎCHIR LE TEMPLATE
        // --------------------------------------------------

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Erreur chargement entretiens :',
          error
        );

        this.entretiens = [];
        this.entretiensFiltres = [];

        this.erreur =
          'Impossible de charger vos entretiens.';

        this.chargement = false;

        this.cdr.detectChanges();

      }

    });

}
  // ==========================================================
  // RECHERCHE
  // ==========================================================

  rechercher(): void {

    this.appliquerFiltres();

  }


  // ==========================================================
  // FILTRE STATUT
  // ==========================================================

  filtrerParStatut(
    statut: string
  ): void {

    this.filtreStatut = statut;

    this.appliquerFiltres();

  }


  // ==========================================================
  // FILTRE TYPE
  // ==========================================================

  filtrerParType(
    type: string
  ): void {

    this.filtreType = type;

    this.appliquerFiltres();

  }


  // ==========================================================
  // APPLICATION DES FILTRES
  // ==========================================================

appliquerFiltres(): void {

  const recherche =
    this.recherche
      .toLowerCase()
      .trim();

  this.entretiensFiltres =
    this.entretiens.filter(
      entretien => {

        // --------------------------------------------------
        // TITRE
        // --------------------------------------------------

        const titre =
          entretien.offre?.titre
            ?.toLowerCase() || '';

        // --------------------------------------------------
        // RECRUTEUR
        // --------------------------------------------------

        const recruteur =
          this.getNomUtilisateur(
            entretien.recruteur
          ).toLowerCase();

        // --------------------------------------------------
        // LIEU
        // --------------------------------------------------

        const lieu =
          entretien.lieu
            ?.toLowerCase() || '';

        // --------------------------------------------------
        // TYPE
        // --------------------------------------------------

        const type =
          entretien.type
            ?.toLowerCase() || '';

        // --------------------------------------------------
        // RECHERCHE
        // --------------------------------------------------

        const rechercheCorrespond =
          !recherche ||
          titre.includes(recherche) ||
          recruteur.includes(recherche) ||
          lieu.includes(recherche) ||
          type.includes(recherche);

        // --------------------------------------------------
        // STATUT
        // --------------------------------------------------

        const statutCorrespond =
          this.filtreStatut === 'Tous' ||
          entretien.statut === this.filtreStatut;

        // --------------------------------------------------
        // TYPE
        // --------------------------------------------------

        const typeCorrespond =
          this.filtreType === 'Tous' ||
          entretien.type === this.filtreType;

        return (
          rechercheCorrespond &&
          statutCorrespond &&
          typeCorrespond
        );

      }
    );

  console.log(
    'Entretiens filtrés :',
    this.entretiensFiltres
  );

  // --------------------------------------------------
  // FORCE ANGULAR À RAFRAÎCHIR
  // --------------------------------------------------

  this.cdr.detectChanges();

}


  // ==========================================================
  // VOIR DETAILS
  // ==========================================================

  voirDetails(
    entretien: Entretien
  ): void {

    this.entretienSelectionne =
      entretien;

    this.afficherDetails = true;

  }


  // ==========================================================
  // FERMER DETAILS
  // ==========================================================

  fermerDetails(): void {

    this.afficherDetails = false;

    this.entretienSelectionne = null;

  }


  // ==========================================================
  // CONFIRMER ENTRETIEN
  // ==========================================================

  confirmerEntretien(
    entretien: Entretien
  ): void {

    if (
      entretien.reponseCandidat ===
      'Confirmé'
    ) {

      return;

    }


    this.reponseEnCours = true;


    this.entretienService
      .repondreEntretien(
        entretien.id,
        'Confirmé'
      )
      .subscribe({

        next: (data) => {

          entretien.reponseCandidat =
            data.reponseCandidat;


          this.reponseEnCours = false;

        },

        error: (error) => {

          console.error(
            'Erreur confirmation entretien :',
            error
          );

          this.reponseEnCours = false;

          alert(
            'Impossible de confirmer l’entretien.'
          );

        }

      });

  }


  // ==========================================================
  // REFUSER ENTRETIEN
  // ==========================================================

  refuserEntretien(
    entretien: Entretien
  ): void {

    const confirmation =
      confirm(
        'Voulez-vous vraiment refuser cet entretien ?'
      );


    if (!confirmation) {

      return;

    }


    this.reponseEnCours = true;


    this.entretienService
      .repondreEntretien(
        entretien.id,
        'Refusé'
      )
      .subscribe({

        next: (data) => {

          entretien.reponseCandidat =
            data.reponseCandidat;


          this.reponseEnCours = false;

        },

        error: (error) => {

          console.error(
            'Erreur refus entretien :',
            error
          );

          this.reponseEnCours = false;

          alert(
            'Impossible de refuser l’entretien.'
          );

        }

      });

  }


  // ==========================================================
  // STATISTIQUES
  // ==========================================================

  get total(): number {

    return this.entretiens.length;

  }


  get aVenir(): number {

    const maintenant =
      new Date().getTime();


    return this.entretiens.filter(
      entretien =>
        new Date(
          entretien.dateHeure
        ).getTime() >= maintenant &&
        entretien.statut !== 'Annulé'
    ).length;

  }


  get confirmes(): number {

    return this.entretiens.filter(
      entretien =>
        entretien.reponseCandidat ===
        'Confirmé'
    ).length;

  }


  get enAttente(): number {

    return this.entretiens.filter(
      entretien =>
        entretien.reponseCandidat ===
        'En attente'
    ).length;

  }


  get termines(): number {

    return this.entretiens.filter(
      entretien =>
        entretien.statut ===
        'Terminé'
    ).length;

  }


  get annules(): number {

    return this.entretiens.filter(
      entretien =>
        entretien.statut ===
        'Annulé'
    ).length;

  }


  // ==========================================================
  // PROCHAIN ENTRETIEN
  // ==========================================================

  get prochainEntretien():
    Entretien | null {

    const maintenant =
      new Date().getTime();


    const futurs =
      this.entretiens
        .filter(
          entretien =>
            new Date(
              entretien.dateHeure
            ).getTime() >= maintenant &&
            entretien.statut !== 'Annulé'
        )
        .sort(
          (a, b) =>
            new Date(a.dateHeure).getTime()
            -
            new Date(b.dateHeure).getTime()
        );


    return futurs.length > 0
      ? futurs[0]
      : null;

  }


  // ==========================================================
  // NOM UTILISATEUR
  // ==========================================================

  getNomUtilisateur(
    utilisateur?: any
  ): string {

    if (!utilisateur) {

      return 'Recruteur';

    }


    const nom =
      `${utilisateur.first_name || ''} ${
        utilisateur.last_name || ''
      }`.trim();


    return nom ||
      utilisateur.username ||
      'Recruteur';

  }


  // ==========================================================
  // CLASSE STATUT
  // ==========================================================

  getClasseStatut(
    statut?: string
  ): string {

    switch (statut) {

      case 'Planifié':
        return 'statut-planifie';

      case 'Confirmé':
        return 'statut-confirme';

      case 'Terminé':
        return 'statut-termine';

      case 'Annulé':
        return 'statut-annule';

      case 'Reporté':
        return 'statut-reporte';

      default:
        return '';

    }

  }


  // ==========================================================
  // CLASSE RÉPONSE
  // ==========================================================

  getClasseReponse(
    reponse?: string
  ): string {

    switch (reponse) {

      case 'Confirmé':
        return 'reponse-confirmee';

      case 'Refusé':
        return 'reponse-refusee';

      case 'En attente':
        return 'reponse-attente';

      default:
        return '';

    }

  }


  // ==========================================================
  // ICÔNE TYPE
  // ==========================================================

  getIconeType(
    type?: string
  ): string {

    switch (type) {

      case 'Visio':
        return 'fas fa-video';

      case 'Présentiel':
        return 'fas fa-building';

      case 'Téléphonique':
        return 'fas fa-phone';

      default:
        return 'fas fa-calendar';

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


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );

  }


  // ==========================================================
  // FORMAT DATE + HEURE
  // ==========================================================

  formaterDateHeure(
    date?: string
  ): string {

    if (!date) {

      return '-';

    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(date)
    );

  }


  // ==========================================================
  // VERIFIER SI ENTRETIEN EST À VENIR
  // ==========================================================

  estAVenir(
    entretien: Entretien
  ): boolean {

    return (
      new Date(
        entretien.dateHeure
      ).getTime()
      >=
      new Date().getTime()
      &&
      entretien.statut !== 'Annulé'
    );

  }

}