import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// ============================================================
// ENTREPRISE
// ============================================================

export interface MissionEntreprise {

  id: number;

  nom: string;

  secteur?: string | null;

  logo?: string | null;

}


// ============================================================
// COMPÉTENCE
// ============================================================

export interface CompetenceMission {

  id: number;

  nom: string;

  niveauRequis: string;

  estObligatoire: boolean;

}


// ============================================================
// FREELANCE
// ============================================================

export interface FreelanceMission {

  id: number;

  username?: string;

  first_name?: string;

  last_name?: string;

  titreProfessionnel?: string;

  photoProfil?: string | null;

}


// ============================================================
// MISSION
// ============================================================

export interface Mission {

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

  entreprise?: MissionEntreprise | null;

  recruteur_nom?: string;

  freelance?: number | null;

  nombreCandidats: number;

  competences: CompetenceMission[];

  est_active?: boolean;

  created_at?: string;

  updated_at?: string;

}


// ============================================================
// DONNÉES DE CRÉATION / MODIFICATION
// ============================================================

export interface MissionRequest {

  titre: string;

  description: string;

  typeMission: string;

  domaine?: string | null;

  localisation?: string | null;

  modeTravail: string;

  budgetMin?: number | null;

  budgetMax?: number | null;

  deviseBudget: string;

  dateLimite?: string | null;

  dateDebut?: string | null;

  dateFinPrevue?: string | null;

  statut?: string;

  entreprise?: number | null;

}


// ============================================================
// SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class MissionRecruteurService {


  // ==========================================================
  // URL API
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}recruteur/missions`;


  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // RÉCUPÉRER MES MISSIONS
  // ==========================================================

  getMesMissions(): Observable<Mission[]> {

    return this.http.get<Mission[]>(
      `${this.apiUrl}/`
    );

  }


  // ==========================================================
  // RÉCUPÉRER UNE MISSION
  // ==========================================================

  getMission(
    id: number
  ): Observable<Mission> {

    return this.http.get<Mission>(
      `${this.apiUrl}/${id}/`
    );

  }


  // ==========================================================
  // CRÉER UNE MISSION
  // ==========================================================

  creerMission(
    data: MissionRequest
  ): Observable<Mission> {

    return this.http.post<Mission>(
      `${this.apiUrl}/`,
      data
    );

  }


  // ==========================================================
  // MODIFIER UNE MISSION
  // ==========================================================

  modifierMission(
    id: number,
    data: Partial<MissionRequest>
  ): Observable<Mission> {

    return this.http.patch<Mission>(
      `${this.apiUrl}/${id}/`,
      data
    );

  }


  // ==========================================================
  // SUPPRIMER UNE MISSION
  // ==========================================================

  supprimerMission(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}/`
    );

  }


  // ==========================================================
  // FERMER UNE MISSION
  // ==========================================================

  fermerMission(
    id: number
  ): Observable<Mission> {

    return this.http.patch<Mission>(
      `${this.apiUrl}/${id}/fermer/`,
      {
        statut: 'fermee'
      }
    );

  }


  // ==========================================================
  // PUBLIER UNE MISSION
  // ==========================================================

  publierMission(
    id: number
  ): Observable<Mission> {

    return this.http.patch<Mission>(
      `${this.apiUrl}/${id}/publier/`,
      {
        statut: 'publiee'
      }
    );

  }


  // ==========================================================
  // PASSER UNE MISSION EN COURS
  // ==========================================================

  demarrerMission(
    id: number
  ): Observable<Mission> {

    return this.http.patch<Mission>(
      `${this.apiUrl}/${id}/demarrer/`,
      {
        statut: 'en_cours'
      }
    );

  }


  // ==========================================================
  // TERMINER UNE MISSION
  // ==========================================================

  terminerMission(
    id: number
  ): Observable<Mission> {

    return this.http.patch<Mission>(
      `${this.apiUrl}/${id}/terminer/`,
      {
        statut: 'terminee'
      }
    );

  }


  // ==========================================================
  // ANNULER UNE MISSION
  // ==========================================================

  annulerMission(
    id: number
  ): Observable<Mission> {

    return this.http.patch<Mission>(
      `${this.apiUrl}/${id}/annuler/`,
      {
        statut: 'annulee'
      }
    );

  }

}