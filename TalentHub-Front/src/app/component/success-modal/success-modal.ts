import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';


@Component({
  selector: 'app-success-modal',
  standalone: false,
  templateUrl: './success-modal.html',
  styleUrl: './success-modal.css',
})
export class SuccessModalComponent {
  constructor(public dialogRef: MatDialogRef<SuccessModalComponent>) {}

  // Le modal se ferme automatiquement après 2 secondes
  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 2000);
  }

}
