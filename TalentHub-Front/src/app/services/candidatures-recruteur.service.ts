import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// ============================================================
// UTILISATEUR
// ============================================================

export interface UserResume {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}


// ============================================================
// DOCUMENT
// ============================================================

export interface DocumentCandidature {
  id: number;
  nomFichier: string;
  typeFichier: string;
  contenu: string;
  taille: number;
  created_at: string;
}


// ============================================================
// OFFRE
// ============================================================

export interface OffreDetail {
  id: number;
  titre: string;
  entreprise: string;
}


// ============================================================
// ENTRETIEN
// ============================================================

export interface Entretien {
  id: number;

  candidature: number;

  recruteur: UserResume;

  candidat: UserResume;

  offre: {
    id: number;
    titre: string;
  };

  dateHeure: string;

  type: 'Visio' | 'Présentiel' | 'Téléphonique';

  lieu?: string | null;

  lienVisio?: string | null;

  statut:
    | 'Planifié'
    | 'Confirmé'
    | 'Terminé'
    | 'Annulé'
    | 'Reporté';

  reponseCandidat:
    | 'En attente'
    | 'Confirmé'
    | 'Refusé';

  commentaire?: string | null;

  motifAnnulation?: string | null;

  created_at: string;

  updated_at: string;
}


// ============================================================
// CANDIDATURE
// ============================================================

export interface Candidature {

  id: number;

  candidat: UserResume;

  offre: number;

  offre_detail: OffreDetail;

  dateSoumission: string;

  dateModification: string;

  nombre_modifications: number;

  statut:
    | 'En attente'
    | 'Présélectionnée'
    | 'Entretien'
    | 'Acceptée'
    | 'Refusée'
    | 'Retirée';

  lettreMotivation?: string | null;

  commentaireRecruteur?: string | null;

  dateDecision?: string | null;

  documents: DocumentCandidature[];

  entretiens: Entretien[];

  // Préparé pour le matching
  matching?: MatchingResult;
}


// ============================================================
// MATCHING
// ============================================================

export interface MatchingResult {

  score: number;

  competences_score: number;

  experience_score: number;

  specialite_score: number;

  etude_score: number;

  profil_score: number;

  competences_correspondantes: CompetenceCorrespondante[];

  competences_manquantes: string[];
}


export interface CompetenceCorrespondante {

  nom: string;

  niveau_requis: string;

  niveau_candidat: string;

  correspond: boolean;
}


// ============================================================
// CHANGEMENT DE STATUT
// ============================================================

export interface CandidatureStatutPayload {

  statut:
    | 'En attente'
    | 'Présélectionnée'
    | 'Entretien'
    | 'Acceptée'
    | 'Refusée'
    | 'Retirée';

  commentaireRecruteur?: string | null;
}


// ============================================================
// SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class CandidaturesRecruteurService {

  private readonly apiUrl =
    `${environment.apiUrl.replace(/\/+$/, '')}`;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // LISTE DES CANDIDATURES
  // ==========================================================

  getCandidatures(): Observable<Candidature[]> {

    return this.http.get<Candidature[]>(
      `${this.apiUrl}/candidatures/`
    );

  }


  // ==========================================================
  // DETAIL
  // ==========================================================

  getCandidature(
    id: number
  ): Observable<Candidature> {

    return this.http.get<Candidature>(
      `${this.apiUrl}/candidatures/${id}/`
    );

  }


  // ==========================================================
  // MODIFIER STATUT
  // ==========================================================

  modifierStatut(
    id: number,
    data: CandidatureStatutPayload
  ): Observable<Candidature> {

    return this.http.put<Candidature>(
      `${this.apiUrl}/candidatures/${id}/`,
      data
    );

  }


  // ==========================================================
  // DOCUMENTS
  // ==========================================================

  getDocuments(
    candidatureId: number
  ): Observable<DocumentCandidature[]> {

    return this.http.get<DocumentCandidature[]>(
      `${this.apiUrl}/documents/`,
      {
        params: new HttpParams()
          .set(
            'candidature',
            candidatureId
          )
      }
    );

  }


  // ==========================================================
  // ENTRETIENS
  // ==========================================================

  getEntretiens(): Observable<Entretien[]> {

    return this.http.get<Entretien[]>(
      `${this.apiUrl}/entretiens/`
    );

  }


  // ==========================================================
  // PLANIFIER ENTRETIEN
  // ==========================================================

  planifierEntretien(
    data: any
  ): Observable<Entretien> {

    return this.http.post<Entretien>(
      `${this.apiUrl}/entretiens/`,
      data
    );

  }


  // ==========================================================
  // MODIFIER ENTRETIEN
  // ==========================================================

  modifierEntretien(
    id: number,
    data: any
  ): Observable<Entretien> {

    return this.http.put<Entretien>(
      `${this.apiUrl}/entretiens/${id}/`,
      data
    );

  }


  // ==========================================================
  // SUPPRIMER ENTRETIEN
  // ==========================================================

  supprimerEntretien(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/entretiens/${id}/`
    );

  }

}