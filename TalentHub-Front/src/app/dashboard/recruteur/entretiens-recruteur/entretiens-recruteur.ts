import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CandidaturesRecruteurService,
  Entretien,
  Candidature
} from '../../../services/candidatures-recruteur.service';


@Component({
  selector: 'app-entretiens-recruteur',
  standalone: false,
  templateUrl: './entretiens-recruteur.html',
  styleUrl: './entretiens-recruteur.css'
})
export class EntretiensRecruteur implements OnInit {


  // ==========================================================
  // DONNEES
  // ==========================================================

  entretiens: Entretien[] = [];

  entretiensFiltres: Entretien[] = [];

  candidatures: Candidature[] = [];

  candidaturesDisponibles: Candidature[] = [];


  // ==========================================================
  // ETAT
  // ==========================================================

  isLoading = true;

  isSaving = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // FILTRES
  // ==========================================================

  searchTerm = '';

  filtreStatut = '';


  // ==========================================================
  // MODAL DETAIL
  // ==========================================================

  showDetailModal = false;

  selectedEntretien: Entretien | null = null;


  // ==========================================================
  // MODAL FORMULAIRE
  // ==========================================================

  showFormModal = false;

  modeModification = false;

  entretienModification: Entretien | null = null;


  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  formData = {

    candidature: null as number | null,

    dateHeure: '',

    type: 'Visio' as
      'Visio' |
      'Présentiel' |
      'Téléphonique',

    lieu: '',

    lienVisio: '',

    statut: 'Planifié' as
      'Planifié' |
      'Confirmé' |
      'Terminé' |
      'Annulé' |
      'Reporté',

    commentaire: ''

  };


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private candidaturesService:
      CandidaturesRecruteurService,

    private cdr:
      ChangeDetectorRef
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.chargerDonnees();

  }


  // ==========================================================
  // CHARGER DONNEES
  // ==========================================================

  chargerDonnees(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.candidaturesService
      .getEntretiens()
      .subscribe({

        next: (data) => {

          console.log(
            'Entretiens recruteur :',
            data
          );

          this.entretiens = data;

          this.appliquerFiltres();

          this.chargerCandidatures();

        },

        error: (error) => {

          console.error(
            'Erreur entretiens :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // CHARGER CANDIDATURES
  // ==========================================================

  chargerCandidatures(): void {

    this.candidaturesService
      .getCandidatures()
      .subscribe({

        next: (data) => {

          this.candidatures = data;

          this.candidaturesDisponibles =
            data.filter(
              candidature =>
                candidature.statut !== 'Refusée' &&
                candidature.statut !== 'Retirée' &&
                candidature.statut !== 'Acceptée'
            );

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur candidatures :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // FILTRES
  // ==========================================================

  appliquerFiltres(): void {

    const recherche =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.entretiensFiltres =
      this.entretiens.filter(
        entretien => {

          const candidat =
            `${entretien.candidat.first_name}
             ${entretien.candidat.last_name}`
              .toLowerCase();

          const username =
            entretien.candidat.username
              .toLowerCase();

          const email =
            entretien.candidat.email
              .toLowerCase();

          const offre =
            entretien.offre.titre
              .toLowerCase();


          const correspondRecherche =
            !recherche ||
            candidat.includes(recherche) ||
            username.includes(recherche) ||
            email.includes(recherche) ||
            offre.includes(recherche);


          const correspondStatut =
            !this.filtreStatut ||
            entretien.statut ===
              this.filtreStatut;


          return (
            correspondRecherche &&
            correspondStatut
          );

        }
      );

  }


  // ==========================================================
  // RESET
  // ==========================================================

  reinitialiserFiltres(): void {

    this.searchTerm = '';

    this.filtreStatut = '';

    this.appliquerFiltres();

  }


  // ==========================================================
  // DETAIL
  // ==========================================================

  voirDetail(
    entretien: Entretien
  ): void {

    this.selectedEntretien =
      entretien;

    this.showDetailModal = true;

  }


  // ==========================================================
  // FERMER DETAIL
  // ==========================================================

  fermerDetail(): void {

    this.showDetailModal = false;

    this.selectedEntretien = null;

  }


  // ==========================================================
  // CREATION
  // ==========================================================

  ouvrirCreation(): void {

    this.modeModification = false;

    this.entretienModification = null;

    this.formData = {

      candidature: null,

      dateHeure: '',

      type: 'Visio',

      lieu: '',

      lienVisio: '',

      statut: 'Planifié',

      commentaire: ''

    };

    this.showFormModal = true;

  }


  // ==========================================================
  // MODIFICATION
  // ==========================================================

  ouvrirModification(
    entretien: Entretien
  ): void {

    this.modeModification = true;

    this.entretienModification =
      entretien;

    this.formData = {

      candidature:
        entretien.candidature,

      dateHeure:
        this.convertirDatePourInput(
          entretien.dateHeure
        ),

      type:
        entretien.type,

      lieu:
        entretien.lieu || '',

      lienVisio:
        entretien.lienVisio || '',

      statut:
        entretien.statut,

      commentaire:
        entretien.commentaire || ''

    };

    this.showFormModal = true;

  }


  // ==========================================================
  // FERMER FORMULAIRE
  // ==========================================================

  fermerFormulaire(): void {

    if (this.isSaving) {
      return;
    }

    this.showFormModal = false;

    this.entretienModification = null;

  }


  // ==========================================================
  // ENREGISTRER
  // ==========================================================

  enregistrerEntretien(): void {

    this.errorMessage = '';

    // --------------------------------------------------------
    // CREATION
    // --------------------------------------------------------

    if (!this.modeModification) {

      if (!this.formData.candidature) {

        this.errorMessage =
          'Veuillez sélectionner une candidature.';

        return;

      }

    }


    if (!this.formData.dateHeure) {

      this.errorMessage =
        'Veuillez renseigner la date et l’heure.';

      return;

    }


    // --------------------------------------------------------
    // PRESENTIEL
    // --------------------------------------------------------

    if (
      this.formData.type === 'Présentiel' &&
      !this.formData.lieu.trim()
    ) {

      this.errorMessage =
        'Le lieu est obligatoire pour un entretien présentiel.';

      return;

    }


    // --------------------------------------------------------
    // VISIO
    // --------------------------------------------------------

    if (
      this.formData.type === 'Visio' &&
      !this.formData.lienVisio.trim()
    ) {

      this.errorMessage =
        'Le lien de visioconférence est obligatoire.';

      return;

    }


    this.isSaving = true;


    const data: any = {

      dateHeure:
        this.formData.dateHeure,

      type:
        this.formData.type,

      lieu:
        this.formData.type === 'Présentiel'
          ? this.formData.lieu
          : null,

      lienVisio:
        this.formData.type === 'Visio'
          ? this.formData.lienVisio
          : null,

      commentaire:
        this.formData.commentaire || null

    };


    // ========================================================
    // MODIFICATION
    // ========================================================

    if (
      this.modeModification &&
      this.entretienModification
    ) {

      data.statut =
        this.formData.statut;


      this.candidaturesService
        .modifierEntretien(
          this.entretienModification.id,
          data
        )
        .subscribe({

          next: (entretien) => {

            const index =
              this.entretiens.findIndex(
                e =>
                  e.id === entretien.id
              );

            if (index !== -1) {

              this.entretiens[index] =
                entretien;

            }

            this.appliquerFiltres();

            this.successMessage =
              'Entretien modifié avec succès.';

            this.isSaving = false;

            this.showFormModal = false;

            this.entretienModification =
              null;

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Erreur modification entretien :',
              error
            );

            this.errorMessage =
              this.getErrorMessage(error);

            this.isSaving = false;

            this.cdr.detectChanges();

          }

        });

      return;

    }


    // ========================================================
    // CREATION
    // ========================================================

    data.candidature =
      this.formData.candidature;


    this.candidaturesService
      .planifierEntretien(data)
      .subscribe({

        next: (entretien) => {

          this.entretiens.unshift(
            entretien
          );

          this.appliquerFiltres();

          this.successMessage =
            'Entretien planifié avec succès.';

          this.isSaving = false;

          this.showFormModal = false;

          this.chargerCandidatures();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur création entretien :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

          this.isSaving = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // SUPPRESSION
  // ==========================================================

  supprimer(
    entretien: Entretien
  ): void {

    const candidat =
      this.getNomCandidat(entretien);


    const confirmation =
      window.confirm(
        `Voulez-vous vraiment supprimer l'entretien de ${candidat} ?`
      );


    if (!confirmation) {
      return;
    }


    this.errorMessage = '';

    this.candidaturesService
      .supprimerEntretien(
        entretien.id
      )
      .subscribe({

        next: () => {

          this.entretiens =
            this.entretiens.filter(
              e =>
                e.id !== entretien.id
            );

          this.appliquerFiltres();

          this.successMessage =
            'Entretien supprimé avec succès.';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur suppression entretien :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // NOM CANDIDAT
  // ==========================================================

  getNomCandidat(
    entretien: Entretien
  ): string {

    const prenom =
      entretien.candidat.first_name ||
      '';

    const nom =
      entretien.candidat.last_name ||
      '';

    const nomComplet =
      `${prenom} ${nom}`.trim();


    return (
      nomComplet ||
      entretien.candidat.username
    );

  }


  // ==========================================================
  // INITIALES
  // ==========================================================

  getInitiales(
    entretien: Entretien
  ): string {

    const prenom =
      entretien.candidat.first_name ||
      '';

    const nom =
      entretien.candidat.last_name ||
      '';


    if (prenom && nom) {

      return (
        prenom.charAt(0) +
        nom.charAt(0)
      ).toUpperCase();

    }


    return entretien.candidat.username
      .substring(0, 2)
      .toUpperCase();

  }


  // ==========================================================
  // NOM CANDIDATURE
  // ==========================================================

  getNomCandidature(
    candidature: Candidature
  ): string {

    const candidat =
      this.getNomCandidatDepuisCandidature(
        candidature
      );

    return candidat;

  }


  private getNomCandidatDepuisCandidature(
    candidature: Candidature
  ): string {

    const prenom =
      candidature.candidat.first_name ||
      '';

    const nom =
      candidature.candidat.last_name ||
      '';

    const nomComplet =
      `${prenom} ${nom}`.trim();


    return (
      nomComplet ||
      candidature.candidat.username
    );

  }


  // ==========================================================
  // STATUT
  // ==========================================================

  getStatutClass(
    statut: string
  ): string {

    const classes: {
      [key: string]: string
    } = {

      'Planifié':
        'status-planifie',

      'Confirmé':
        'status-confirme',

      'Terminé':
        'status-termine',

      'Annulé':
        'status-annule',

      'Reporté':
        'status-reporte'

    };


    return (
      classes[statut] ||
      'status-default'
    );

  }


  // ==========================================================
  // TYPE
  // ==========================================================

  getTypeClass(
    type: string
  ): string {

    const classes: {
      [key: string]: string
    } = {

      'Visio':
        'type-visio',

      'Présentiel':
        'type-presentiel',

      'Téléphonique':
        'type-telephone'

    };


    return (
      classes[type] ||
      'type-default'
    );

  }


  getTypeIcon(
    type: string
  ): string {

    const icons: {
      [key: string]: string
    } = {

      'Visio':
        'fa-video',

      'Présentiel':
        'fa-location-dot',

      'Téléphonique':
        'fa-phone'

    };


    return (
      icons[type] ||
      'fa-calendar'
    );

  }


  // ==========================================================
  // REPONSE CANDIDAT
  // ==========================================================

  getReponseClass(
    reponse: string
  ): string {

    const classes: {
      [key: string]: string
    } = {

      'En attente':
        'response-attente',

      'Confirmé':
        'response-confirme',

      'Refusé':
        'response-refuse'

    };


    return (
      classes[reponse] ||
      'response-default'
    );

  }


  // ==========================================================
  // STATISTIQUES
  // ==========================================================

  getNombreParStatut(
    statut: string
  ): number {

    return this.entretiens.filter(
      entretien =>
        entretien.statut === statut
    ).length;

  }


  getNombreEntretiensAVenir(): number {

    const maintenant =
      new Date();


    return this.entretiens.filter(
      entretien => {

        const date =
          new Date(
            entretien.dateHeure
          );

        return (
          date > maintenant &&
          entretien.statut !== 'Annulé'
        );

      }
    ).length;

  }


  // ==========================================================
  // DATE POUR INPUT
  // ==========================================================

  private convertirDatePourInput(
    date: string
  ): string {

    if (!date) {
      return '';
    }


    const d =
      new Date(date);


    const annee =
      d.getFullYear();

    const mois =
      String(
        d.getMonth() + 1
      ).padStart(2, '0');

    const jour =
      String(
        d.getDate()
      ).padStart(2, '0');

    const heures =
      String(
        d.getHours()
      ).padStart(2, '0');

    const minutes =
      String(
        d.getMinutes()
      ).padStart(2, '0');


    return `${annee}-${mois}-${jour}T${heures}:${minutes}`;

  }


  // ==========================================================
  // ACTUALISER
  // ==========================================================

  actualiser(): void {

    this.chargerDonnees();

  }


  // ==========================================================
  // MESSAGE ERREUR
  // ==========================================================

  private getErrorMessage(
    error: any
  ): string {

    if (error?.error?.detail) {

      return error.error.detail;

    }


    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      const values =
        Object.values(
          error.error
        );


      if (values.length) {

        return values
          .map(value =>
            Array.isArray(value)
              ? value.join(', ')
              : String(value)
          )
          .join(' ');

      }

    }


    return 'Une erreur est survenue.';

  }

}
