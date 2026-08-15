import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// ==========================================
// INTERFACE UTILISATEUR
// ==========================================

export interface UserProfile {

  id?: number;

  username: string;

  email?: string;

  first_name?: string;

  last_name?: string;

  role: 'candidat' | 'recruteur' | 'freelance' | 'admin';

  telephone?: string;

  numCni?: string;

  dateNaissance?: string;

  lieuNaissance?: string;

  sexe?: 'M' | 'F' | '';

  niveauEtude?: string;

  nationalite?: string;

  specialite?: string;

  statut?: string;

  dernierDiplome?: string;

  dateObtentionDiplome?: string;

  numPassport?: string;

  dateEmbauche?: string;
}


// ==========================================
// SERVICE UTILISATEUR
// ==========================================

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // RÉCUPÉRER TOUS LES UTILISATEURS
  // ==========================================

  getUsers(): Observable<UserProfile[]> {

    return this.http.get<UserProfile[]>(
      `${this.apiUrl}inscription/`
    );

  }


  // ==========================================
  // RÉCUPÉRER LES TALENTS
  // CANDIDAT + FREELANCE
  // ==========================================

  getTalents(): Observable<UserProfile[]> {

    return this.http.get<UserProfile[]>(
      `${this.apiUrl}inscription/`
    );

  }

}
