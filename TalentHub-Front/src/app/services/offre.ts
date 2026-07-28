import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Offre {
  id: number;
  titre: string;
  datePublication: string;
  dateLimite: string;
  typeOffre: string;
  description: string;
  entreprise?: {
    nom: string;
    adresse?: string;
    secteur?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OffreService {
  private apiUrl = 'http://127.0.0.1:8000/api/offres/offres/';

  constructor(private http: HttpClient) {}

  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }

  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}${id}/`);
  }
}
