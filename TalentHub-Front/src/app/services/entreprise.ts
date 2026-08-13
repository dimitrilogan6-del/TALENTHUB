import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Entreprise } from '../models/entreprise.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  // Remplacez par l'URL de votre API Django
  private apiUrl = " http://127.0.0.1:8000/api/entreprise/";

  // Données de test (fallback / mockup)
  private mockEntreprises: Entreprise[] = [
    {
      id: 1,
      nom: 'Sonatel',
      domaine: 'Télécoms',
      localisation: 'Dakar, Sénégal',
      description: 'Premier opérateur de télécommunications au Sénégal offrant des opportunités variées en Tech, Data et Management.'
    },
    {
      id: 2,
      nom: 'Wave Mobile Money',
      domaine: 'Fintech',
      localisation: 'Dakar, Sénégal',
      description: "Leader de l'inclusion financière avec un service de mobile money simple, rapide et radicalement abordable."
    }
  ];

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer toutes les entreprises
  getEntreprises(): Observable<Entreprise[]> {
    // Une fois votre backend Django prêt, décommentez la ligne suivante :
    // return this.http.get<Entreprise[]>(this.apiUrl);

    return of(this.mockEntreprises);
  }
}