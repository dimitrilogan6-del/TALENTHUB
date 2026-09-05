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

  secteur: string | null;

  logo: string | null;

}


// ============================================================
// COMPÉTENCE
// ============================================================

export interface CompetenceMission {

  id: number;

  nom: string;

  niveauRequis:
    | 'debutant'
    | 'intermediaire'
    | 'avance'
    | 'expert';

  estObligatoire: boolean;

}


// ============================================================
// MISSION
// ============================================================

export interface Mission {

  id: number;

  titre: string;

  description: string;

  typeMission:
    | 'ponctuelle'
    | 'projet'
    | 'longue_duree'
    | 'temps_partiel'
    | 'temps_plein';

  domaine: string | null;

  localisation: string | null;

  modeTravail:
    | 'sur_place'
    | 'hybride'
    | 'distance';

  budgetMin: number | null;

  budgetMax: number | null;

  deviseBudget: string;

  datePublication: string;

  dateLimite: string | null;

  dateDebut: string | null;

  dateFinPrevue: string | null;

  statut: string;

  entreprise: MissionEntreprise;

  recruteur_nom: string;

  freelance: number | null;

  nombreCandidats: number;

  competences: CompetenceMission[];

  est_active: boolean;

  created_at: string;

  updated_at: string;

}


// ============================================================
// CANDIDATURE
// ============================================================

export interface CandidatureMission {

  id: number;

  mission: Mission;

  freelance: number;

  freelance_nom: string;

  proposition: string | null;

  montantPropose: number | null;

  devise: string;

  delaiPropose: number | null;

  statut:
    | 'envoyee'
    | 'en_examen'
    | 'acceptee'
    | 'refusee'
    | 'retiree';

  dateCandidature: string;

  updated_at: string;

}


// ============================================================
// SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class MissionService {


  private apiUrl =
    environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // RÉCUPÉRER LES MISSIONS
  // ==========================================================

  getMissions(): Observable<Mission[]> {

    console.log(
      'GET MISSIONS :',
      this.apiUrl + 'missions/'
    );

    return this.http.get<Mission[]>(
      this.apiUrl + 'missions/'
    );

  }


  // ==========================================================
  // RÉCUPÉRER UNE MISSION
  // ==========================================================

  getMission(
    id: number
  ): Observable<Mission> {

    return this.http.get<Mission>(
      `${this.apiUrl}missions/${id}/`
    );

  }


  // ==========================================================
  // MES CANDIDATURES
  // ==========================================================

  getMesCandidatures():
    Observable<CandidatureMission[]> {

    console.log(
      'GET MES CANDIDATURES :',
      this.apiUrl + 'candidatures_missions/'
    );

    return this.http.get<CandidatureMission[]>(
      this.apiUrl + 'candidatures_missions/'
    );

  }


  // ==========================================================
  // POSTULER
  // ==========================================================

  postuler(
    data: {
      mission: number;
      proposition?: string;
      montantPropose?: number | null;
      devise?: string;
      delaiPropose?: number | null;
    }
  ): Observable<CandidatureMission> {

    console.log(
      'POST CANDIDATURE :',
      data
    );

    return this.http.post<CandidatureMission>(
      this.apiUrl + 'candidatures_missions/',
      data
    );

  }


  // ==========================================================
  // RETIRER UNE CANDIDATURE
  // ==========================================================

  retirerCandidature(
    id: number
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}candidatures_missions/${id}/`,
      {
        statut: 'retiree'
      }
    );

  }

}