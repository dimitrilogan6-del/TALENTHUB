import { Component, OnInit } from '@angular/core';
import { OffreService, Offre } from '../../services/offre';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-offre-list',
  templateUrl: './offre-list.html',
  styleUrls: ['./offre-list.css'],
  standalone: false
})
export class OffreList implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;
  offres: Offre[] = [];
  filteredOffres: Offre[] = [];

  searchTerm: string = '';
  selectedType: string = 'Tous les contrats';
  selectedVille: string = 'Toutes les villes';

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    
        this.offreService.getOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.filteredOffres = data;
        this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
        // Initialise l'affichage à la page 1
        this.paginate();
      }});
  }
  // Méthode pour découper la liste selon la page
  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    // On met à jour filteredOffres avec seulement les offres de la page actuelle
    this.filteredOffres = this.offres.slice(start, end);
  }

  // Méthode pour changer de page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }
  // Appelée quand on tape dans la recherche
  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // Appelée quand on change un filtre
  onFilterChange(): void {
    this.applyFilters();
  }

  // Logique de filtrage combinée
  private applyFilters(): void {
    this.filteredOffres = this.offres.filter(offre => {
      const matchSearch = this.searchTerm === '' ||
                          offre.titre.toLowerCase().includes(this.searchTerm) ||
                          (offre.entreprise?.nom || '').toLowerCase().includes(this.searchTerm);

      const matchType = this.selectedType === 'Tous les contrats' ||
                        offre.typeOffre === this.selectedType;

      const matchVille = this.selectedVille === 'Toutes les villes' ||
                        (offre.entreprise?.adresse || '').toLowerCase() === this.selectedVille.toLowerCase();

      return matchSearch && matchType && matchVille;
    });
  }
}