import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';


// ============================================================
// ENTREPRISE
// ============================================================

export interface Entreprise {

  id: number;

  nom: string;

  secteur?: string | null;

  adresse?: string | null;

  telephone?: string | null;

  email?: string | null;

  siteweb?: string | null;

  description?: string | null;

  logo?: string | null;

  statut?: string;

  verifiee?: boolean;

}


// ============================================================
// COMPÉTENCE
// ============================================================

export interface Competence {

  id: number;

  nom: string;

  description?: string | null;

}


// ============================================================
// NIVEAU COMPÉTENCE
// ============================================================

export interface NiveauCompetence {

  id?: number;

  offre?: number;

  competence: number;

  competenceNom?: string;

  niveauRequis:
    | 'debutant'
    | 'intermediaire'
    | 'avance'
    | 'expert';

  estObligatoire: boolean;

}


// ============================================================
// OFFRE
// ============================================================

export interface Offre {

  id?: number;

  titre: string;

  description: string;

  typeOffre: string;

  localisation: string | null;

  salaireMin: number | null;

  salaireMax: number | null;

  deviseSalaire: string;

  datePublication?: string;

  dateLimite: string;

  statut: string;

  entreprise?: number;

  entrepriseDetail?: Entreprise;

  recruteur?: number;

  recruteurNom?: string;

  competences?: NiveauCompetence[];

  created_at?: string;

  updated_at?: string;

}


// ============================================================
// PAYLOAD
// ============================================================

export interface OffrePayload {

  titre: string;

  description: string;

  typeOffre: string;

  localisation: string | null;

  salaireMin: number | null;

  salaireMax: number | null;

  deviseSalaire: string;

  dateLimite: string;

  statut: string;

  entreprise: number | null;

}


// ============================================================
// SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class RecruteurOffresService {


  private readonly apiUrl =
    `${environment.apiUrl.replace(/\/+$/, '')}`;


  constructor(
    private http: HttpClient
  ) {}


  // =========================================================
  // MES OFFRES
  // =========================================================

  getOffres(): Observable<Offre[]> {

    return this.http.get<Offre[]>(
      `${this.apiUrl}/offres/offres/`
    );

  }


  // =========================================================
  // UNE OFFRE
  // =========================================================

  getOffre(
    id: number
  ): Observable<Offre> {

    return this.http.get<Offre>(
      `${this.apiUrl}/offres/offres/${id}/`
    );

  }


  // =========================================================
  // MES ENTREPRISES
  // =========================================================

  getMesEntreprises():
    Observable<Entreprise[]> {

    return this.http.get<Entreprise[]>(
      `${this.apiUrl}/offres/mes-entreprises/`
    );

  }


  // =========================================================
  // CRÉER
  // =========================================================

  creerOffre(
    data: OffrePayload
  ): Observable<Offre> {

    return this.http.post<Offre>(
      `${this.apiUrl}/offres/offres/`,
      data
    );

  }


  // =========================================================
  // MODIFIER
  // =========================================================

  modifierOffre(
    id: number,
    data: OffrePayload
  ): Observable<Offre> {

    return this.http.put<Offre>(
      `${this.apiUrl}/offres/offres/${id}/`,
      data
    );

  }


  // =========================================================
  // SUPPRIMER
  // =========================================================

  supprimerOffre(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/offres/offres/${id}/`
    );

  }


  // =========================================================
  // COMPÉTENCES
  // =========================================================

  getCompetences():
    Observable<Competence[]> {

    return this.http.get<Competence[]>(
      `${this.apiUrl}/offres/competences/`
    );

  }


  // =========================================================
  // AJOUTER COMPÉTENCE À UNE OFFRE
  // =========================================================

  ajouterCompetenceOffre(
    data: NiveauCompetence
  ): Observable<NiveauCompetence> {

    return this.http.post<NiveauCompetence>(
      `${this.apiUrl}/offres/niveaux-competences/`,
      data
    );

  }


  // =========================================================
  // MODIFIER COMPÉTENCE D'UNE OFFRE
  // =========================================================

  modifierCompetenceOffre(
    id: number,
    data: NiveauCompetence
  ): Observable<NiveauCompetence> {

    return this.http.put<NiveauCompetence>(
      `${this.apiUrl}/offres/niveaux-competences/${id}/`,
      data
    );

  }


  // =========================================================
  // SUPPRIMER COMPÉTENCE D'UNE OFFRE
  // =========================================================

  supprimerCompetenceOffre(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/offres/niveaux-competences/${id}/`
    );

  }

}