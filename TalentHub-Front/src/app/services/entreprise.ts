import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Entreprise {
  id?: number;
  nom: string;
  secteur: string;
  localisation: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
   private apiUrl = { "entreprises" : " http://127.0.0.1:8000/api/entreprise/entreprises/ " };

  constructor(private http: HttpClient) {}

  getEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(this.apiUrl.entreprises);
  }
}