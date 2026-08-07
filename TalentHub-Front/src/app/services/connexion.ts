import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Connexion {
  // L'adresse de votre API Django (adaptez si besoin)
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  /**
   * Méthode de connexion.
   * Elle envoie les identifiants vers /api/token/ pour obtenir le JWT.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    // Django Simple JWT attend 'username' par défaut.
    // On transforme donc l'email en username pour l'API.
    const payload = {
      username: credentials.email,
      password: credentials.password
    };
    return this.http.post(`${this.apiUrl}token/`, payload);
  }

  /**
   * Méthode d'inscription.
   * Appelle votre endpoint /api/inscription/.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}inscription/`, userData);
  }

  /**
   * Vérifie si l'utilisateur est connecté (token présent).
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Déconnexion : supprime le token du navigateur.
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}