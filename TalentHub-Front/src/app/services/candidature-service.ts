import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// ==========================================================
// UTILISATEUR
// ==========================================================

export interface UserResume {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}


// ==========================================================
// OFFRE
// ==========================================================

export interface OffreDetail {
  id: number;
  titre: string;
  entreprise: string;
}


// ==========================================================
// DOCUMENT
// ==========================================================

export interface DocumentCandidature {
  id: number;
  nomFichier: string;
  typeFichier: string;
  contenu: string;
  taille: number;
  created_at: string;
}


// ==========================================================
// ENTRETIEN
// ==========================================================

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

  lieu?: string;

  lienVisio?: string;

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

  commentaire?: string;

  motifAnnulation?: string;

  created_at: string;

  updated_at: string;
}


// ==========================================================
// CANDIDATURE
// ==========================================================

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

  lettreMotivation?: string;

  commentaireRecruteur?: string;

  dateDecision?: string;

  documents: DocumentCandidature[];

  entretiens: Entretien[];
}


// ==========================================================
// SERVICE
// ==========================================================

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  private apiUrl =
    environment.apiUrl +
    'candidatures/candidatures/';


  constructor(
    private http: HttpClient
  ) {}


  // ========================================================
  // MES CANDIDATURES
  // ========================================================

  getMesCandidatures(): Observable<Candidature[]> {

    return this.http.get<Candidature[]>(
      this.apiUrl
    );

  }


  // ========================================================
  // UNE CANDIDATURE
  // ========================================================

  getCandidatureById(
    id: number
  ): Observable<Candidature> {

    return this.http.get<Candidature>(
      `${this.apiUrl}${id}/`
    );

  }


  // ========================================================
  // POSTULER
  // ========================================================

  envoyerCandidature(
    data: FormData
  ): Observable<Candidature> {

    return this.http.post<Candidature>(
      this.apiUrl,
      data
    );

  }


  // ========================================================
  // MODIFIER UNE CANDIDATURE
  // ========================================================

  modifierCandidature(
    id: number,
    data: FormData
  ): Observable<Candidature> {

    return this.http.patch<Candidature>(
      `${this.apiUrl}${id}/`,
      data
    );

  }


  // ========================================================
  // RETIRER UNE CANDIDATURE
  // ========================================================

  retirerCandidature(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${id}/`
    );

  }


  // ========================================================
  // DOCUMENTS
  // ========================================================

  getDocuments(
    candidatureId: number
  ): Observable<DocumentCandidature[]> {

    const url =
      environment.apiUrl +
      'candidatures/documents/';

    return this.http.get<DocumentCandidature[]>(
      `${url}?candidature=${candidatureId}`
    );

  }


  // ========================================================
  // ENTRETIENS
  // ========================================================

  getMesEntretiens(): Observable<Entretien[]> {

    const url =
      environment.apiUrl +
      'candidatures/entretiens/';

    return this.http.get<Entretien[]>(
      url
    );

  }


  // ========================================================
  // REPONDRE A UN ENTRETIEN
  // ========================================================

  repondreEntretien(
    id: number,
    reponseCandidat: 'En attente' | 'Confirmé' | 'Refusé'
  ): Observable<Entretien> {

    const url =
      environment.apiUrl +
      'candidatures/entretiens/';

    return this.http.patch<Entretien>(
      `${url}${id}/`,
      {
        reponseCandidat
      }
    );

  }

}