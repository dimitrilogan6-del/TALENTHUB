import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseService } from '../../services/entreprise';

@Component({
  selector: 'app-entreprise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entreprise.html',
  styleUrl: './entreprise.css'
})
export class Entreprise{}
// export class Entreprise implements OnInit {
  // entreprises: EntrepriseModel[] = [];

  // constructor(private entrepriseService: EntrepriseService) {}

  // ngOnInit(): void {
  //   this.entrepriseService.getEntreprises().subscribe({
  //     next: (data: EntrepriseModel[]) => {
  //       console.log('Données reçues:', data);
  //       this.entreprises = data;
  //       console.log('entreprises après assignation:', this.entreprises);
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du chargement des entreprises:', err);
  //     }
  //   });
  // }
// }