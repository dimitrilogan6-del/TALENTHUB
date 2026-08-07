import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-inscription-modal',
  templateUrl: './success-inscription-modal.html',
  styleUrls: ['./success-inscription-modal.css'],
  standalone: false,
})
export class SuccessInscriptionModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessInscriptionModalComponent>,
    private router: Router
  ) {}

  goToLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}