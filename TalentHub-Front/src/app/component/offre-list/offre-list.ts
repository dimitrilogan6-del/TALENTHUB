import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { OffreService } from '../../services/offre';
import { Offre } from '../../models/offre.model';


@Component({
  selector: 'app-offre-list',
  templateUrl: './offre-list.html',
  styleUrls: ['./offre-list.css'],
  standalone: false
})
export class OffreList implements OnInit {

  // =====================================================
  // DONNÉES
  // =====================================================

  offres: Offre[] = [];

  filteredOffres: Offre[] = [];


  // =====================================================
  // RECHERCHE
  // =====================================================

  searchTerm: string = '';


  // =====================================================
  // FILTRES
  // =====================================================

  selectedType: string = 'Tous les contrats';

  selectedVille: string = 'Toutes les villes';


  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage: number = 1;

  itemsPerPage: number = 6;

  totalPages: number = 0;


  // =====================================================
  // ÉTATS
  // =====================================================

  isLoading: boolean = true;

  errorMessage: string = '';


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private offreService: OffreService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.loadOffres();

  }


  // =====================================================
  // CHARGEMENT DES OFFRES
  // =====================================================

  loadOffres(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.offreService
      .getOffres()
      .subscribe({

        next: (data: Offre[]) => {

          console.log(
            '================================='
          );

          console.log(
            'OFFRES REÇUES DEPUIS DJANGO'
          );

          console.log(
            data
          );

          console.log(
            '================================='
          );


          // -------------------------------------------------
          // Vérification de la réponse
          // -------------------------------------------------

          if (Array.isArray(data)) {

            this.offres = data;

          } else {

            this.offres = [];

          }


          console.log(
            'Nombre total d’offres :',
            this.offres.length
          );


          // -------------------------------------------------
          // Première page
          // -------------------------------------------------

          this.currentPage = 1;


          // -------------------------------------------------
          // Application des filtres
          // -------------------------------------------------

          this.applyFilters();


          this.isLoading = false;


          this.cdr.detectChanges();


          console.log(
            'Offres affichées :',
            this.filteredOffres
          );

        },


        error: (error) => {

          console.error(
            'Erreur lors du chargement des offres :',
            error
          );


          this.offres = [];

          this.filteredOffres = [];

          this.totalPages = 0;

          this.isLoading = false;


          this.errorMessage =
            'Impossible de charger les offres. Veuillez réessayer.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // RECHERCHE
  // =====================================================

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    this.searchTerm =
      input.value
        .trim()
        .toLowerCase();


    this.currentPage = 1;


    this.applyFilters();

  }


  // =====================================================
  // CHANGEMENT DES FILTRES
  // =====================================================

  onFilterChange(): void {

    this.currentPage = 1;

    this.applyFilters();

  }


  // =====================================================
  // FILTRAGE
  // =====================================================

  private applyFilters(): void {

    const filtered =
      this.offres.filter(
        (offre: Offre) => {


          // =================================================
          // RECHERCHE
          // =================================================

          const titre =
            (
              offre.titre || ''
            )
              .toString()
              .toLowerCase();


          const description =
            (
              offre.description || ''
            )
              .toString()
              .toLowerCase();


          /*
           * Avec ton backend Django,
           * l'entreprise est directement dans :
           *
           * offre.entreprise
           *
           * et non :
           *
           * offre.entrepriseDetail
           */

          const entreprise =
            (
              offre.entrepriseDetail?.nom || ''
            )
              .toString()
              .toLowerCase();


          const secteur =
            (
              offre.entrepriseDetail?.secteur || ''
            )
              .toString()
              .toLowerCase();


          const matchSearch =

            this.searchTerm === '' ||

            titre.includes(
              this.searchTerm
            ) ||

            description.includes(
              this.searchTerm
            ) ||

            entreprise.includes(
              this.searchTerm
            ) ||

            secteur.includes(
              this.searchTerm
            );


          // =================================================
          // TYPE DE CONTRAT
          // =================================================

          const typeOffre =
            (
              offre.typeOffre || ''
            )
              .toString()
              .toLowerCase();


          const typeSelectionne =
            this.selectedType
              .toLowerCase();


          const matchType =

            this.selectedType ===
              'Tous les contrats' ||

            typeOffre ===
              typeSelectionne;


          // =================================================
          // VILLE / LOCALISATION
          // =================================================

          /*
           * Ton modèle Offre possède :
           *
           * localisation
           *
           * donc on utilise cette propriété.
           */

          const localisation =
            (
              offre.localisation || ''
            )
              .toString()
              .toLowerCase()
              .trim();


          const adresseEntreprise =
            (
              offre.entrepriseDetail?.adresse || ''
            )
              .toString()
              .toLowerCase()
              .trim();


          const villeSelectionnee =
            this.selectedVille
              .toLowerCase()
              .trim();


          const matchVille =

            this.selectedVille ===
              'Toutes les villes' ||

            localisation.includes(
              villeSelectionnee
            ) ||

            adresseEntreprise.includes(
              villeSelectionnee
            );


          // =================================================
          // RÉSULTAT
          // =================================================

          return (
            matchSearch &&
            matchType &&
            matchVille
          );

        }
      );


    console.log(
      '================================='
    );

    console.log(
      'RÉSULTAT DU FILTRAGE'
    );

    console.log(
      filtered
    );

    console.log(
      '================================='
    );


    // =====================================================
    // PAGINATION
    // =====================================================

    this.totalPages =
      Math.ceil(
        filtered.length /
        this.itemsPerPage
      );


    // -----------------------------------------------------
    // Si aucune page
    // -----------------------------------------------------

    if (this.totalPages === 0) {

      this.currentPage = 1;

    }


    // -----------------------------------------------------
    // Empêcher une page invalide
    // -----------------------------------------------------

    if (
      this.totalPages > 0 &&
      this.currentPage > this.totalPages
    ) {

      this.currentPage =
        this.totalPages;

    }


    // =====================================================
    // DÉCOUPAGE DES OFFRES
    // =====================================================

    const start =
      (
        this.currentPage - 1
      ) *
      this.itemsPerPage;


    const end =
      start +
      this.itemsPerPage;


    this.filteredOffres =
      filtered.slice(
        start,
        end
      );


    console.log(
      'Offres affichées :',
      this.filteredOffres
    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  changePage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;

    this.applyFilters();

  }


  // =====================================================
  // PAGE SUIVANTE
  // =====================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.applyFilters();

    }

  }


  // =====================================================
  // PAGE PRÉCÉDENTE
  // =====================================================

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.applyFilters();

    }

  }


  // =====================================================
  // RÉINITIALISER LES FILTRES
  // =====================================================

  resetFilters(): void {

    this.searchTerm = '';

    this.selectedType =
      'Tous les contrats';

    this.selectedVille =
      'Toutes les villes';

    this.currentPage = 1;

    this.applyFilters();

  }

}