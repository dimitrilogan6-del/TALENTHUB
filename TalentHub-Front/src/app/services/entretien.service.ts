import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// ============================================================
// INTERFACES
// ============================================================

export interface UtilisateurResume {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OffreEntretien {
  id: number;
  titre: string;
}

export interface Entretien {
  id: number;

  candidature: number;

  recruteur: UtilisateurResume;

  candidat: UtilisateurResume;

  offre: OffreEntretien;

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


@Injectable({
  providedIn: 'root'
})
export class EntretienService {

  private apiUrl =
    'http://127.0.0.1:8000/api/candidatures/entretiens/';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // TOUS LES ENTRETIENS DU CANDIDAT CONNECTÉ
  // ==========================================================

  getMesEntretiens(): Observable<Entretien[]> {

    return this.http.get<Entretien[]>(
      this.apiUrl
    );

  }


  // ==========================================================
  // UN ENTRETIEN
  // ==========================================================

  getEntretien(
    id: number
  ): Observable<Entretien> {

    return this.http.get<Entretien>(
      `${this.apiUrl}${id}/`
    );

  }


  // ==========================================================
  // RÉPONDRE À UN ENTRETIEN
  // ==========================================================

  repondreEntretien(
    id: number,
    reponse: 'En attente' | 'Confirmé' | 'Refusé'
  ): Observable<Entretien> {

    return this.http.patch<Entretien>(
      `${this.apiUrl}${id}/`,
      {
        reponseCandidat: reponse
      }
    );

  }

}