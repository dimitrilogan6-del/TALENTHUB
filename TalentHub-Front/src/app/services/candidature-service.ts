import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Candidature {
  id?: number;
  dateSoumission?: string;
  statut?: string;
  offre: number;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
private apiUrl = 'http://127.0.0.1:8000/api/candidatures/candidatures/';
  constructor(private http: HttpClient) { }

  // Le paramètre est de type FormData pour gérer l'upload de fichier
  envoyerCandidature(data: FormData): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, data);
  }
}