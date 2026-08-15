import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CandidatureService } from '../../services/candidature-service';
import { SuccessModalComponent } from '../success-modal/success-modal';

interface PostulerModalData {
  titre: string;
  entreprise: string;
  offreId: number;
}

@Component({
  selector: 'app-candidature-modal',
  standalone: false,
  templateUrl: './candidature-modal.html',
  styleUrls: ['./candidature-modal.css']
})
export class CandidatureModal {

  // ==============================
  // DONNÉES DU FORMULAIRE
  // ==============================

  selectedFile: File | null = null;

  selectedFileName: string = '';

  lettreMotivation: string = '';

  // ==============================
  // ÉTAT DU FORMULAIRE
  // ==============================

  isSubmitting: boolean = false;

  errorMessage: string = '';

  // ==============================
  // CONSTRUCTEUR
  // ==============================

  constructor(
    public dialogRef: MatDialogRef<CandidatureModal>,

    @Inject(MAT_DIALOG_DATA)
    public data: PostulerModalData,

    private dialog: MatDialog,

    private candidatureService: CandidatureService,

    private router: Router
  ) {}

  // ============================================================
  // SÉLECTION DU CV
  // ============================================================

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    // Aucun fichier sélectionné
    if (!input.files || input.files.length === 0) {

      this.selectedFile = null;
      this.selectedFileName = '';

      return;
    }

    const file = input.files[0];

    // On efface l'ancien message
    this.errorMessage = '';

    // ============================================================
    // VÉRIFICATION DU TYPE
    // ============================================================

    if (file.type !== 'application/pdf') {

      this.errorMessage =
        'Veuillez sélectionner un fichier PDF.';

      input.value = '';

      this.selectedFile = null;
      this.selectedFileName = '';

      return;
    }

    // ============================================================
    // VÉRIFICATION DE LA TAILLE
    // Maximum : 5 Mo
    // ============================================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      this.errorMessage =
        'Votre CV ne doit pas dépasser 5 Mo.';

      input.value = '';

      this.selectedFile = null;
      this.selectedFileName = '';

      return;
    }

    // ============================================================
    // FICHIER VALIDE
    // ============================================================

    this.selectedFile = file;

    this.selectedFileName = file.name;

    this.errorMessage = '';

    console.log(
      'CV sélectionné :',
      file.name
    );
  }

  // ============================================================
  // FERMER LE MODAL
  // ============================================================

  closeModal(): void {

    // On empêche de fermer accidentellement pendant l'envoi
    if (this.isSubmitting) {
      return;
    }

    this.dialogRef.close();
  }

  // ============================================================
  // REDIRECTION VERS LA CONNEXION
  // ============================================================

  goToLogin(): void {

    if (this.isSubmitting) {
      return;
    }

    this.dialogRef.close();

    this.router.navigate(['/login']);
  }

  // ============================================================
  // ENVOYER LA CANDIDATURE
  // ============================================================

  submitCandidature(): void {

    // Empêcher plusieurs clics
    if (this.isSubmitting) {
      return;
    }

    // Nettoyer l'ancien message
    this.errorMessage = '';

    // ============================================================
    // VÉRIFICATION DU CV
    // ============================================================

    if (!this.selectedFile) {

      this.errorMessage =
        'Veuillez importer votre CV au format PDF.';

      return;
    }

    // ============================================================
    // VÉRIFICATION DE LA LETTRE
    // ============================================================

    const lettre = this.lettreMotivation.trim();

    if (!lettre) {

      this.errorMessage =
        'Veuillez saisir une courte lettre de motivation.';

      return;
    }

    // ============================================================
    // ACTIVATION DU CHARGEMENT
    // ============================================================

    this.isSubmitting = true;

    // ============================================================
    // FORM DATA
    // ============================================================

    const formData = new FormData();

    formData.append(
      'offre',
      String(this.data.offreId)
    );

    formData.append(
      'document',
      this.selectedFile,
      this.selectedFile.name
    );

    formData.append(
      'lettreMotivation',
      lettre
    );

    // ============================================================
    // LOG
    // ============================================================

    console.log(
      'Envoi candidature...',
      {
        offre: this.data.offreId,
        fichier: this.selectedFile.name,
        lettre: lettre
      }
    );

    // ============================================================
    // APPEL API
    // ============================================================

    this.candidatureService
      .envoyerCandidature(formData)
      .subscribe({

        // ========================================================
        // SUCCÈS
        // ========================================================

        next: (response) => {

          console.log(
            'Candidature envoyée avec succès :',
            response
          );

          this.isSubmitting = false;

          // Fermer le formulaire
          this.dialogRef.close();

          // Afficher le succès
          this.dialog.open(
            SuccessModalComponent,
            {
              width: '450px',
              maxWidth: '95vw',
              disableClose: true
            }
          );
        },

        // ========================================================
        // ERREUR
        // ========================================================

       error: (error) => {

  console.error('Statut HTTP :', error.status);
  console.error('Réponse Django :', error.error);

  this.isSubmitting = false;

  if (error.status === 400) {
    this.errorMessage = this.getDjangoErrorMessage(error.error);
  }
  else if (error.status === 401) {
    this.errorMessage =
      'Votre session a expiré. Veuillez vous reconnecter.';
  }
  else if (error.status === 403) {
    this.errorMessage =
      'Vous n’avez pas l’autorisation de postuler à cette offre.';
  }
  else if (error.status === 404) {
    this.errorMessage =
      'Cette offre n’existe plus ou n’est plus disponible.';
  }
  else if (error.status >= 500) {
    this.errorMessage =
      'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
  }
  else {
    this.errorMessage =
      'Impossible d’envoyer votre candidature. Veuillez réessayer.';
  }

  console.log(
    'MESSAGE FINAL AFFICHÉ :',
    this.errorMessage
  );
}
      });
  }

  // ============================================================
  // TRANSFORMATION DES ERREURS DJANGO
  // ============================================================

  private getDjangoErrorMessage(error: any): string {

    console.log(
      'Analyse erreur Django :',
      error
    );

    // Aucun contenu
    if (!error) {

      return 'Une erreur est survenue lors de l’envoi de votre candidature.';
    }

    // ============================================================
    // CAS :

    // {
    //   "candidat": [
    //     "Vous avez déjà postulé à cette offre."
    //   ]
    // }
    // ============================================================

    if (error.candidat) {

      return this.extractMessage(
        error.candidat
      );
    }

    // ============================================================
    // OFFRE
    // ============================================================

    if (error.offre) {

      return this.extractMessage(
        error.offre
      );
    }

    // ============================================================
    // DOCUMENT
    // ============================================================

    if (error.document) {

      return this.extractMessage(
        error.document
      );
    }

    // ============================================================
    // LETTRE
    // ============================================================

    if (error.lettreMotivation) {

      return this.extractMessage(
        error.lettreMotivation
      );
    }

    // ============================================================
    // NON FIELD ERRORS
    // ============================================================

    if (error.non_field_errors) {

      return this.extractMessage(
        error.non_field_errors
      );
    }

    // ============================================================
    // DETAIL
    // ============================================================

    if (error.detail) {

      return this.extractMessage(
        error.detail
      );
    }

    // ============================================================
    // MESSAGE
    // ============================================================

    if (error.message) {

      return this.extractMessage(
        error.message
      );
    }

    // ============================================================
    // ERREUR DIRECTEMENT SOUS FORME DE STRING
    // ============================================================

    if (typeof error === 'string') {

      return error;
    }

    // ============================================================
    // FALLBACK
    // ============================================================

    return 'La candidature n’a pas pu être envoyée.';
  }

  // ============================================================
  // EXTRAIRE LE TEXTE
  // ============================================================

  private extractMessage(value: any): string {

    // Tableau
    if (Array.isArray(value)) {

      if (value.length === 0) {

        return 'Une erreur est survenue.';
      }

      return this.extractMessage(
        value[0]
      );
    }

    // Chaîne
    if (typeof value === 'string') {

      return value;
    }

    // Objet
    if (typeof value === 'object' && value !== null) {

      // Certains objets peuvent contenir message
      if (value.message) {

        return this.extractMessage(
          value.message
        );
      }

      return JSON.stringify(value);
    }

    return 'Une erreur est survenue.';
  }
}
