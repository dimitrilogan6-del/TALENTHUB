import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CandidatureService} from '../../services/candidature-service';


@Component({
  selector: 'app-candidature-modal',
  templateUrl: './candidature-modal.html',
  styleUrls: ['./candidature-modal.css'],
  standalone: false
})
export class CandidatureModal {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  lettreMotivation: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';   

  constructor(
    public dialogRef: MatDialogRef<CandidatureModal >,
    @Inject(MAT_DIALOG_DATA) public data: { titre: string; entreprise: string; offreId: number },
    private dialog: MatDialog,
    private candidatureService: CandidatureService,
    private router: Router  
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  // Nouvelle méthode pour aller à la page de connexion
  goToLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  submitCandidature(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('offre', String(this.data.offreId));
    if (this.selectedFile) {
      formData.append('document', this.selectedFile, this.selectedFile.name); 
    }

    this.candidatureService.envoyerCandidature(formData).subscribe({
      next: (response) => {
        console.log('Candidature envoyée !', response);
        this.dialogRef.close();
        // this.dialog.open(SuccessModal, { width: '450px', disableClose: true });
      },
  error: (error) => {
    console.error('Erreur :', error);
    this.isSubmitting = false;

    if (error.status === 400) {
      // L'erreur vient de Django (contrainte ou validation)
      if (error.error?.non_field_errors) {
        this.errorMessage = error.error.non_field_errors[0];
      } else if (error.error?.offre) {
        this.errorMessage = "Vous avez déjà postulé à cette offre.";
      } else {
        this.errorMessage = "Erreur : " + JSON.stringify(error.error);
      }
    } else if (error.status === 401) {
      this.errorMessage = "Vous devez être connecté pour postuler.";
    } else {
      this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
    }
  }
    });
  }
}