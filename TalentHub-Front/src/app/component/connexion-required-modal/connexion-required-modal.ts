import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-connexion-required-modal',
  standalone: false,
  templateUrl: './connexion-required-modal.html',
  styleUrl: './connexion-required-modal.css'
})
export class ConnexionRequiredModalComponent {

  constructor(
    private dialogRef:
      MatDialogRef<ConnexionRequiredModalComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      titre: string;
    }
  ) {}


  /**
   * Aller vers la connexion
   */
  goToLogin(): void {

    this.dialogRef.close('login');

  }


  /**
   * Fermer
   */
  close(): void {

    this.dialogRef.close();

  }

}