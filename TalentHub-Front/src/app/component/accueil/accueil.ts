import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { OffreService } from '../../services/offre';

import { Offre } from '../../models/offre.model';

import { EntrepriseService } from '../../services/entreprise';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-accueil',
  standalone: false,
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil implements OnInit {


  // =====================================================
  // DONNÉES
  // =====================================================

  offres: Offre[] = [];

  filteredOffres: Offre[] = [];

  entreprises: any[] = [];

  utilisateurs: any[] = [];

  talents: any[] = [];


  // =====================================================
  // STATISTIQUES
  // =====================================================

  nombreOffres: number = 0;

  nombreEntreprises: number = 0;

  nombreTalents: number = 0;


  // =====================================================
  // RECHERCHE ET FILTRES
  // =====================================================

  searchTerm: string = '';

  selectedType: string =
    'Tous les contrats';

  selectedVille: string =
    'Toutes les villes';


  // =====================================================
  // ÉTAT
  // =====================================================

  isLoading: boolean = true;

  errorMessage: string = '';


  // Nombre de requêtes terminées

  private chargementsTermines: number = 0;


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private offreService: OffreService,
    private entrepriseService: EntrepriseService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    console.log(
      '================================='
    );

    console.log(
      'HOME INITIALISÉ'
    );

    console.log(
      '================================='
    );


    this.isLoading = true;

    this.errorMessage = '';

    this.chargementsTermines = 0;


    // -----------------------------------------------------
    // Charger les offres
    // -----------------------------------------------------

    this.chargerOffres();


    // -----------------------------------------------------
    // Charger les entreprises
    // -----------------------------------------------------

    this.chargerEntreprises();


    // -----------------------------------------------------
    // Charger les utilisateurs
    // -----------------------------------------------------

    this.chargerUtilisateurs();

  }


  // =====================================================
  // CHARGEMENT DES OFFRES
  // =====================================================

  chargerOffres(): void {

    console.log(
      'Chargement des offres...'
    );


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
          // Vérification
          // -------------------------------------------------

          if (Array.isArray(data)) {

            this.offres = data;

          } else {

            this.offres = [];

          }


          // -------------------------------------------------
          // Toutes les offres au départ
          // -------------------------------------------------

          this.filteredOffres =
            [...this.offres];


          // -------------------------------------------------
          // Statistique
          // -------------------------------------------------

          this.nombreOffres =
            this.offres.length;


          console.log(
            'Nombre total d’offres :',
            this.nombreOffres
          );


          this.verifierChargement();

        },


        error: (error) => {

          console.error(
            'Erreur lors du chargement des offres :',
            error
          );


          this.offres = [];

          this.filteredOffres = [];

          this.nombreOffres = 0;


          this.errorMessage =
            'Impossible de charger les offres.';


          this.verifierChargement();

        }

      });

  }


  // =====================================================
  // CHARGEMENT DES ENTREPRISES
  // =====================================================

  chargerEntreprises(): void {

    console.log(
      'Chargement des entreprises...'
    );


    this.entrepriseService
      .getEntreprises()
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'Entreprises reçues depuis API :',
            data
          );


          this.entreprises =
            Array.isArray(data)
              ? data
              : [];


          this.nombreEntreprises =
            this.entreprises.length;


          console.log(
            'Nombre total d’entreprises :',
            this.nombreEntreprises
          );


          this.verifierChargement();

        },


        error: (error) => {

          console.error(
            'Erreur lors du chargement des entreprises :',
            error
          );


          this.entreprises = [];

          this.nombreEntreprises = 0;


          /*
           * Même si les entreprises
           * ne sont pas disponibles,
           * on laisse la page continuer.
           */

          this.verifierChargement();

        }

      });

  }


  // =====================================================
  // UTILISATEURS / TALENTS
  // =====================================================

  chargerUtilisateurs(): void {

    console.log(
      'Chargement des utilisateurs...'
    );


    const apiUrl =
      environment.apiUrl +
      'inscription/';


    this.http
      .get<any[]>(apiUrl)
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'Utilisateurs reçus depuis API :',
            data
          );


          this.utilisateurs =
            Array.isArray(data)
              ? data
              : [];


          // =================================================
          // CANDIDATS + FREELANCES
          // =================================================

          this.talents =
            this.utilisateurs.filter(
              (utilisateur: any) => {

                const role =
                  utilisateur.role
                    ?.toString()
                    .trim()
                    .toLowerCase();


                return (
                  role === 'candidat' ||
                  role === 'freelance'
                );

              }
            );


          this.nombreTalents =
            this.talents.length;


          console.log(
            'Talents trouvés :',
            this.talents
          );


          console.log(
            'Nombre total de talents :',
            this.nombreTalents
          );


          this.verifierChargement();

        },


        error: (error) => {

          console.error(
            'Erreur lors du chargement des utilisateurs :',
            error
          );


          this.utilisateurs = [];

          this.talents = [];

          this.nombreTalents = 0;


          this.verifierChargement();

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
        .toLowerCase()
        .trim();


    this.applyFilters();

  }


  // =====================================================
  // FILTRE
  // =====================================================

  onFilterChange(): void {

    this.applyFilters();

  }


  // =====================================================
  // APPLICATION DES FILTRES
  // =====================================================

  private applyFilters(): void {

    this.filteredOffres =
      this.offres.filter(
        (offre: Offre) => {


          // =================================================
          // TITRE
          // =================================================

          const titre =
            (
              offre.titre || ''
            )
              .toString()
              .toLowerCase();


          // =================================================
          // DESCRIPTION
          // =================================================

          const description =
            (
              offre.description || ''
            )
              .toString()
              .toLowerCase();


          // =================================================
          // ENTREPRISE
          // =================================================

          /*
           * IMPORTANT :
           *
           * Ton backend Django renvoie
           * l'entreprise sous :
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


          // =================================================
          // RECHERCHE
          // =================================================

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


          const selectedType =
            this.selectedType
              .toLowerCase();


          const matchType =

            this.selectedType ===
              'Tous les contrats' ||

            typeOffre ===
              selectedType;


          // =================================================
          // VILLE / LOCALISATION
          // =================================================

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


          const ville =
            this.selectedVille
              .toLowerCase()
              .trim();


          const matchVille =

            this.selectedVille ===
              'Toutes les villes' ||

            localisation.includes(
              ville
            ) ||

            adresseEntreprise.includes(
              ville
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
      'Offres après filtrage :',
      this.filteredOffres
    );

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


    this.filteredOffres =
      [...this.offres];

  }


  // =====================================================
  // VÉRIFIER LES CHARGEMENTS
  // =====================================================

  private verifierChargement(): void {

    this.chargementsTermines++;


    /*
     * Nous avons trois requêtes :
     *
     * 1. Offres
     * 2. Entreprises
     * 3. Utilisateurs
     */

    if (
      this.chargementsTermines >= 3
    ) {

      this.isLoading = false;


      console.log(
        '================================='
      );

      console.log(
        'TOUTES LES DONNÉES SONT CHARGÉES'
      );

      console.log(
        'Offres :',
        this.nombreOffres
      );

      console.log(
        'Entreprises :',
        this.nombreEntreprises
      );

      console.log(
        'Talents :',
        this.nombreTalents
      );

      console.log(
        '================================='
      );


      this.cdr.detectChanges();

    }

  }

}