import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseService } from '../services/entreprise';
import { Entreprise } from '../models/entreprise.model';

@Component({
  selector: 'app-entreprises',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entreprises.html',
  styleUrls: ['./entreprises.css']
})
export class EntreprisesComponent implements OnInit {
  entreprises: Entreprise[] = [];

  constructor(private entrepriseService: EntrepriseService) {}

  ngOnInit(): void {
    this.entrepriseService.getEntreprises().subscribe({
      next: (data) => {
        this.entreprises = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des entreprises', err);
      }
    });
  }
}