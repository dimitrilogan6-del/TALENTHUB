import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface UserProfil {

  id: number;

  username: string;

  email: string;

  first_name: string;

  last_name: string;
}

export interface Profil {

  id: number;

  user: UserProfil;

  role:
    | 'candidat'
    | 'recruteur'
    | 'freelance';

  numCni: string | null;

  dateNaissance: string | null;

  lieuNaissance: string | null;

  telephone: string | null;

  numPassport: string | null;

  sexe: string | null;

  nationalite: string | null;

  niveauEtude: string | null;

  dernierDiplome: string | null;

  dateObtentionDiplome: string | null;

  specialite: string | null;

  dateEmbauche: string | null;

  fonction: string | null;

  statut_recruteur: string;

  titreProfessionnel: string | null;

  biographie: string | null;

  anneesExperience: number;

  tarifHoraire: number | null;

  deviseTarif: string;

  disponibilite: boolean;

  portfolioUrl: string | null;

  linkedinUrl: string | null;

  githubUrl: string | null;

  statut_compte: string;

  photoProfil: string | null;

  nom_complet: string;

  est_admin: boolean;

  profile_completion: number;

  created_at: string;

  updated_at: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private apiUrl =
    environment.apiUrl + 'profil/';

  constructor(
    private http: HttpClient
  ) {}

  // =========================================================
  // PROFIL CONNECTÉ
  // =========================================================

  getMonProfil(): Observable<Profil> {

    return this.http.get<Profil>(
      this.apiUrl
    );

  }

  // =========================================================
  // MODIFIER LE PROFIL
  // =========================================================

  updateProfil(
    data: Partial<Profil>
  ): Observable<Profil> {

    return this.http.patch<Profil>(
      this.apiUrl,
      data
    );

  }

}