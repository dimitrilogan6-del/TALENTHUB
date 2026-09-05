import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  RecruteurOffresService,
  Offre,
  OffrePayload,
  Competence,
  NiveauCompetence,
  Entreprise
} from '../../../services/recruteur-offres.service';


@Component({
  selector: 'app-offres',
  standalone: false,
  templateUrl: './offres.html',
  styleUrl: './offres.css'
})
export class OffresRecruteur implements OnInit {

  // =========================================================
  // DONNÉES
  // =========================================================

  offres: Offre[] = [];

  competences: Competence[] = [];

  entreprises: Entreprise[] = [];


  // =========================================================
  // ÉTATS
  // =========================================================

  isLoading = true;

  isLoadingEntreprises = true;

  isSaving = false;

  errorMessage = '';

  successMessage = '';


  // =========================================================
  // MODAL
  // =========================================================

  showModal = false;

  isEditing = false;

  selectedOffreId: number | null = null;


  // =========================================================
  // FORMULAIRE
  // =========================================================

  form: OffrePayload = {
    titre: '',
    description: '',
    typeOffre: 'CDI',
    localisation: '',
    salaireMin: null,
    salaireMax: null,
    deviseSalaire: 'FCFA',
    dateLimite: '',
    statut: 'brouillon',
    entreprise: null
  };


  // =========================================================
  // COMPÉTENCES
  // =========================================================

  competencesForm: NiveauCompetence[] = [];


  // =========================================================
  // CONSTRUCTEUR
  // =========================================================

  constructor(
    private offresService: RecruteurOffresService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.chargerOffres();

    this.chargerCompetences();

    this.chargerEntreprises();

  }


  // =========================================================
  // CHARGER OFFRES
  // =========================================================

  chargerOffres(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.offresService
      .getOffres()
      .subscribe({

        next: (data) => {

          console.log(
            'Offres recruteur :',
            data
          );

          this.offres = data;

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur chargement offres :',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CHARGER ENTREPRISES DU RECRUTEUR
  // =========================================================

  chargerEntreprises(): void {

    this.isLoadingEntreprises = true;

    this.offresService
      .getMesEntreprises()
      .subscribe({

        next: (data) => {

          console.log(
            'Entreprises du recruteur :',
            data
          );

          this.entreprises = data;

          this.isLoadingEntreprises = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur entreprises :',
            error
          );

          this.entreprises = [];

          this.isLoadingEntreprises = false;

          this.errorMessage =
            'Impossible de charger vos entreprises.';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CHARGER COMPÉTENCES
  // =========================================================

  chargerCompetences(): void {

    this.offresService
      .getCompetences()
      .subscribe({

        next: (data) => {

          this.competences = data;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur compétences :',
            error
          );

        }

      });

  }


  // =========================================================
  // OUVRIR CRÉATION
  // =========================================================

  ouvrirCreation(): void {

    this.isEditing = false;

    this.selectedOffreId = null;

    this.errorMessage = '';

    this.successMessage = '';

    this.form = {

      titre: '',

      description: '',

      typeOffre: 'CDI',

      localisation: '',

      salaireMin: null,

      salaireMax: null,

      deviseSalaire: 'FCFA',

      dateLimite: '',

      statut: 'brouillon',

      entreprise:
        this.entreprises.length > 0
          ? this.entreprises[0].id
          : null

    };

    this.competencesForm = [];

    this.showModal = true;

    this.cdr.detectChanges();

  }


  // =========================================================
  // OUVRIR MODIFICATION
  // =========================================================

  ouvrirModification(
    offre: Offre
  ): void {

    this.isEditing = true;

    this.selectedOffreId =
      offre.id || null;

    this.errorMessage = '';

    this.successMessage = '';

    this.form = {

      titre: offre.titre,

      description: offre.description,

      typeOffre: offre.typeOffre,

      localisation:
        offre.localisation,

      salaireMin:
        offre.salaireMin,

      salaireMax:
        offre.salaireMax,

      deviseSalaire:
        offre.deviseSalaire,

      dateLimite:
        offre.dateLimite,

      statut:
        offre.statut,

      entreprise:
        offre.entreprise || null

    };

    this.competencesForm =
      offre.competences
        ? offre.competences.map(
            competence => ({
              ...competence
            })
          )
        : [];

    this.showModal = true;

    this.cdr.detectChanges();

  }


  // =========================================================
  // FERMER MODAL
  // =========================================================

  fermerModal(): void {

    if (this.isSaving) {
      return;
    }

    this.showModal = false;

    this.cdr.detectChanges();

  }


  // =========================================================
  // AJOUT COMPÉTENCE
  // =========================================================

  ajouterCompetence(): void {

    if (this.competences.length === 0) {

      this.errorMessage =
        'Aucune compétence disponible.';

      return;

    }

    this.competencesForm.push({

      competence:
        this.competences[0].id,

      niveauRequis:
        'intermediaire',

      estObligatoire:
        true

    });

  }


  // =========================================================
  // SUPPRIMER COMPÉTENCE
  // =========================================================

  supprimerCompetence(
    index: number
  ): void {

    this.competencesForm.splice(
      index,
      1
    );

  }


  // =========================================================
  // ENREGISTRER
  // =========================================================

  enregistrer(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // -------------------------
    // VALIDATION
    // -------------------------

    if (
      !this.form.titre.trim() ||
      !this.form.description.trim() ||
      !this.form.dateLimite
    ) {

      this.errorMessage =
        'Veuillez remplir les champs obligatoires.';

      return;

    }


    if (!this.form.entreprise) {

      this.errorMessage =
        'Veuillez sélectionner une entreprise.';

      return;

    }


    if (
      this.form.salaireMin !== null &&
      this.form.salaireMax !== null &&
      this.form.salaireMin > this.form.salaireMax
    ) {

      this.errorMessage =
        'Le salaire minimum ne peut pas dépasser le salaire maximum.';

      return;

    }


    // -------------------------
    // VÉRIFICATION COMPÉTENCES
    // -------------------------

    const competencesInvalides =
      this.competencesForm.some(
        competence =>
          !competence.competence ||
          competence.competence <= 0
      );

    if (competencesInvalides) {

      this.errorMessage =
        'Veuillez sélectionner une compétence valide.';

      return;

    }


    this.isSaving = true;


    if (this.isEditing) {

      this.modifier();

    } else {

      this.creer();

    }

  }


  // =========================================================
  // CRÉER
  // =========================================================

  private creer(): void {

    console.log(
      '========================================'
    );

    console.log(
      'DONNÉES ENVOYÉES POUR CRÉATION'
    );

    console.log(
      this.form
    );

    console.log(
      'Entreprise sélectionnée :',
      this.form.entreprise
    );

    console.log(
      '========================================'
    );


    this.offresService
      .creerOffre(this.form)
      .subscribe({

        next: (offre) => {

          console.log(
            'Offre créée :',
            offre
          );

          if (!offre.id) {

            this.isSaving = false;

            this.errorMessage =
              'L’offre a été créée mais son identifiant est introuvable.';

            return;

          }

          this.enregistrerCompetences(
            offre.id
          );

        },

        error: (error) => {

          console.error(
            'Erreur création :',
            error
          );

          console.error(
            'Status HTTP :',
            error.status
          );

          console.error(
            'Réponse Django :',
            error.error
          );

          console.error(
            'Message Django :',
            JSON.stringify(
              error.error,
              null,
              2
            )
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // MODIFIER
  // =========================================================

  private modifier(): void {

    if (!this.selectedOffreId) {

      this.isSaving = false;

      this.errorMessage =
        'Offre introuvable.';

      return;

    }


    this.offresService
      .modifierOffre(
        this.selectedOffreId,
        this.form
      )
      .subscribe({

        next: (offre) => {

          console.log(
            'Offre modifiée :',
            offre
          );

          this.enregistrerCompetences(
            this.selectedOffreId!
          );

        },

        error: (error) => {

          console.error(
            'Erreur modification :',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // ENREGISTRER COMPÉTENCES
  // =========================================================

  private enregistrerCompetences(
    offreId: number
  ): void {

    // ---------------------------------------------------------
    // IMPORTANT :
    // Pour une modification, on supprime d'abord les anciennes
    // compétences puis on recrée celles du formulaire.
    // ---------------------------------------------------------

    const anciennesCompetences =
      this.competencesForm
        .filter(
          competence => competence.id
        );


    if (
      this.isEditing &&
      anciennesCompetences.length > 0
    ) {

      this.supprimerAnciennesCompetences(
        anciennesCompetences,
        offreId
      );

      return;

    }


    this.ajouterNouvellesCompetences(
      offreId
    );

  }


  // =========================================================
  // SUPPRIMER ANCIENNES COMPÉTENCES
  // =========================================================

  private supprimerAnciennesCompetences(
    anciennes: NiveauCompetence[],
    offreId: number
  ): void {

    let termine = 0;


    anciennes.forEach(
      competence => {

        this.offresService
          .supprimerCompetenceOffre(
            competence.id!
          )
          .subscribe({

            next: () => {

              termine++;

              if (
                termine === anciennes.length
              ) {

                this.ajouterNouvellesCompetences(
                  offreId
                );

              }

            },

            error: (error) => {

              console.error(
                'Erreur suppression ancienne compétence :',
                error
              );

              termine++;

              if (
                termine === anciennes.length
              ) {

                this.ajouterNouvellesCompetences(
                  offreId
                );

              }

            }

          });

      }

    );

  }


  // =========================================================
  // AJOUTER NOUVELLES COMPÉTENCES
  // =========================================================

  private ajouterNouvellesCompetences(
    offreId: number
  ): void {

    if (
      this.competencesForm.length === 0
    ) {

      this.finaliserEnregistrement();

      return;

    }


    let termine = 0;

    const total =
      this.competencesForm.length;


    this.competencesForm.forEach(
      competence => {

        this.offresService
          .ajouterCompetenceOffre({

            offre: offreId,

            competence:
              competence.competence,

            niveauRequis:
              competence.niveauRequis,

            estObligatoire:
              competence.estObligatoire

          })
          .subscribe({

            next: () => {

              termine++;

              if (
                termine === total
              ) {

                this.finaliserEnregistrement();

              }

            },

            error: (error) => {

              console.error(
                'Erreur compétence :',
                error
              );

              termine++;

              if (
                termine === total
              ) {

                this.finaliserEnregistrement();

              }

            }

          });

      }

    );

  }


  // =========================================================
  // FINALISER
  // =========================================================

  private finaliserEnregistrement(): void {

    this.isSaving = false;

    this.showModal = false;

    this.successMessage =
      this.isEditing
        ? 'Offre modifiée avec succès.'
        : 'Offre créée avec succès.';


    this.chargerOffres();

    this.cdr.detectChanges();

  }


  // =========================================================
  // SUPPRIMER OFFRE
  // =========================================================

  supprimer(
    offre: Offre
  ): void {

    if (!offre.id) {
      return;
    }


    const confirmation =
      confirm(
        `Voulez-vous vraiment supprimer l'offre "${offre.titre}" ?`
      );


    if (!confirmation) {
      return;
    }


    this.offresService
      .supprimerOffre(offre.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Offre supprimée avec succès.';

          this.chargerOffres();

        },

        error: (error) => {

          console.error(
            'Erreur suppression :',
            error
          );

          this.errorMessage =
            this.getErrorMessage(error);

        }

      });

  }


  // =========================================================
  // NOM ENTREPRISE
  // =========================================================

  getEntrepriseName(
    id: number | null | undefined
  ): string {

    if (!id) {
      return 'Aucune entreprise';
    }

    const entreprise =
      this.entreprises.find(
        e => e.id === id
      );

    return entreprise?.nom || 'Entreprise inconnue';

  }


  // =========================================================
  // NOM COMPÉTENCE
  // =========================================================

  getCompetenceName(
    id: number
  ): string {

    const competence =
      this.competences.find(
        c => c.id === id
      );

    return competence?.nom || '';

  }


  // =========================================================
  // STATUT LABEL
  // =========================================================

  getStatutLabel(
    statut: string
  ): string {

    const labels: {
      [key: string]: string
    } = {

      brouillon: 'Brouillon',

      en_attente: 'En attente',

      publiee: 'Publiée',

      suspendue: 'Suspendue',

      expiree: 'Expirée',

      fermee: 'Fermée'

    };

    return labels[statut] || statut;

  }


  // =========================================================
  // STATUT CLASS
  // =========================================================

  getStatutClass(
    statut: string
  ): string {

    return `status-${statut}`;

  }


  // =========================================================
  // MESSAGE ERREUR
  // =========================================================

  private getErrorMessage(
    error: any
  ): string {

    if (
      error?.error?.detail
    ) {

      return error.error.detail;

    }


    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      const values =
        Object.entries(
          error.error
        );


      if (values.length) {

        return values
          .map(
            ([field, value]) => {

              const message =
                Array.isArray(value)
                  ? value.join(', ')
                  : String(value);

              return `${field} : ${message}`;

            }
          )
          .join(' ');

      }

    }


    return 'Une erreur est survenue.';

  }


  // =========================================================
  // ACTUALISER
  // =========================================================

  actualiser(): void {

    this.chargerOffres();

    this.chargerEntreprises();

  }

}