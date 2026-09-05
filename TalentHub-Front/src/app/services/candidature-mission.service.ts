import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';


// ============================================================
// ENTREPRISE
// ============================================================

export interface CandidatureMissionEntreprise {

  id: number;

  nom: string;

  secteur?: string | null;

  logo?: string | null;

}


// ============================================================
// COMPÉTENCE
// ============================================================

export interface CandidatureMissionCompetence {

  id: number;

  nom: string;

  niveauRequis: string;

  estObligatoire: boolean;

}


// ============================================================
// MISSION
// ============================================================

export interface CandidatureMissionDetail {

  id: number;

  titre: string;

  description: string;

  typeMission: string;

  domaine?: string | null;

  localisation?: string | null;

  modeTravail: string;

  budgetMin?: number | null;

  budgetMax?: number | null;

  deviseBudget: string;

  datePublication?: string;

  dateLimite?: string | null;

  dateDebut?: string | null;

  dateFinPrevue?: string | null;

  statut: string;

  entreprise?: CandidatureMissionEntreprise | null;

  recruteur_nom?: string;

  freelance?: number | null;

  nombreCandidats: number;

  competences: CandidatureMissionCompetence[];

  est_active?: boolean;

}


// ============================================================
// FREELANCE
// ============================================================

export interface CandidatureMissionFreelance {

  id: number;

  username?: string;

  first_name?: string;

  last_name?: string;

  email?: string;

  titreProfessionnel?: string;

  biographie?: string;

  anneesExperience?: number;

  tarifHoraire?: number | null;

  deviseTarif?: string;

  disponibilite?: boolean;

  portfolioUrl?: string | null;

  linkedinUrl?: string | null;

  githubUrl?: string | null;

  photoProfil?: string | null;

}


// ============================================================
// CANDIDATURE
// ============================================================

export interface CandidatureMission {

  id: number;

  mission: CandidatureMissionDetail;

  freelance: number;

  freelance_nom: string;

  proposition?: string | null;

  montantPropose?: number | null;

  devise: string;

  delaiPropose?: number | null;

  statut: string;

  dateCandidature: string;

  updated_at: string;

}


// ============================================================
// RÉPONSE PAGINÉE DRF
// ============================================================

export interface CandidatureMissionPaginatedResponse {

  count: number;

  next?: string | null;

  previous?: string | null;

  results: CandidatureMission[];

}


// ============================================================
// SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class CandidatureMissionService {


  // ==========================================================
  // URL API
  // ==========================================================

private readonly apiUrl =
  `${environment.apiUrl}recruteur/candidatures`;

  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // RÉCUPÉRER LES CANDIDATURES
  // ==========================================================

  getCandidatures(): Observable<CandidatureMission[]> {

    return this.http
      .get<
        CandidatureMission[] |
        CandidatureMissionPaginatedResponse
      >(
        `${this.apiUrl}/`
      )
      .pipe(

        map(response => {

          // --------------------------------------------------
          // CAS 1 :
          // API retourne directement un tableau
          // --------------------------------------------------

          if (Array.isArray(response)) {

            return response;

          }


          // --------------------------------------------------
          // CAS 2 :
          // API retourne une pagination DRF
          // --------------------------------------------------

          if (
            response &&
            Array.isArray(response.results)
          ) {

            return response.results;

          }


          // --------------------------------------------------
          // CAS 3 :
          // Réponse inattendue
          // --------------------------------------------------

          console.warn(
            'Réponse inattendue de l API candidatures :',
            response
          );

          return [];

        })

      );

  }


  // ==========================================================
  // RÉCUPÉRER UNE CANDIDATURE
  // ==========================================================

  getCandidature(
    id: number
  ): Observable<CandidatureMission> {

    return this.http.get<CandidatureMission>(
      `${this.apiUrl}/${id}/`
    );

  }


  // ==========================================================
  // ACCEPTER
  // ==========================================================

  accepter(
    id: number
  ): Observable<CandidatureMission> {

    return this.http.patch<CandidatureMission>(
      `${this.apiUrl}/${id}/`,
      {
        statut: 'acceptee'
      }
    );

  }


  // ==========================================================
  // REFUSER
  // ==========================================================

  refuser(
    id: number
  ): Observable<CandidatureMission> {

    return this.http.patch<CandidatureMission>(
      `${this.apiUrl}/${id}/`,
      {
        statut: 'refusee'
      }
    );

  }


  // ==========================================================
  // METTRE EN EXAMEN
  // ==========================================================

  mettreEnExamen(
    id: number
  ): Observable<CandidatureMission> {

    return this.http.patch<CandidatureMission>(
      `${this.apiUrl}/${id}/`,
      {
        statut: 'en_examen'
      }
    );

  }


  // ==========================================================
  // MODIFIER LE STATUT
  // ==========================================================

  modifierStatut(
    id: number,
    statut: string
  ): Observable<CandidatureMission> {

    return this.http.patch<CandidatureMission>(
      `${this.apiUrl}/${id}/`,
      {
        statut
      }
    );

  }

}