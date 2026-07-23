import { Component } from '@angular/core';

// Structure d'une entreprise (Interface)
interface Company {
  id: number;
  name: string;
  location: string;
  badge: string;
  badgeClass: string;
  description: string;
}

@Component({
  selector: 'app-freelance',
  standalone: true,
  imports: [],
  templateUrl: './freelance.html',
  styleUrl: './freelance.css'
})
export class Freelance {
  // Liste des entreprises collaboratrices
  companies: Company[] = [
    {
      id: 1,
      name: 'Jumia Group',
      location: '📍 Lagos, Nigeria (International)',
      badge: 'E-commerce',
      badgeClass: 'badge-blue',
      description: 'Leader du e-commerce en Afrique. Quête de talents indépendants en développement web, UI/UX design et marketing digital.'
    },
    {
      id: 2,
      name: 'Safaricom',
      location: '📍 Nairobi, Kenya',
      badge: 'Telecoms & Fintech',
      badgeClass: 'badge-green',
      description: "Créateur de la solution M-Pesa. Recherche d'experts indépendants en sécurité informatique, Cloud et architecture système."
    },
    {
      id: 3,
      name: 'Yassir',
      location: '📍 Alger, Algérie (Expansion AOF / Afrique)',
      badge: 'Super App / Transport',
      badgeClass: 'badge-purple',
      description: 'Application de services à la demande. Besoins de développeurs Mobile (Flutter/React Native) et Data Analysts.'
    },
    {
      id: 4,
      name: 'Wave Mobile Money',
      location: '📍 Dakar, Sénégal (UEMOA)',
      badge: 'Fintech',
      badgeClass: 'badge-yellow',
      description: 'Leader du Mobile Money avec un service sans frais. Recrute régulièrement des profils tech et support à distance.'
    }
  ];
}