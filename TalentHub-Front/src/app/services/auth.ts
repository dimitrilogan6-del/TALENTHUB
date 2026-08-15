import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  tap
} from 'rxjs/operators';

import {
  environment
} from '../../environments/environment';


export interface LoginCredentials {

  username: string;

  password: string;

}


export interface LoginResponse {

  access: string;

  refresh: string;

}


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl =
    environment.apiUrl;


  // =========================================================
  // ÉTAT DE CONNEXION
  // =========================================================

  private loggedInSubject =
    new BehaviorSubject<boolean>(
      this.isLoggedIn()
    );


  isLoggedIn$ =
    this.loggedInSubject.asObservable();


  constructor(
    private http: HttpClient
  ) {}


  // =========================================================
  // CONNEXION
  // =========================================================

  login(
    credentials: LoginCredentials
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}token/`,
      credentials
    );

  }


  // =========================================================
  // SAUVEGARDER LES TOKENS
  // =========================================================

  saveTokens(
    access: string,
    refresh: string,
    rememberMe: boolean
  ): void {

    const storage =
      rememberMe
        ? localStorage
        : sessionStorage;


    storage.setItem(
      'access_token',
      access
    );


    storage.setItem(
      'refresh_token',
      refresh
    );


    // Informe immédiatement
    // toute l'application

    this.loggedInSubject.next(
      true
    );

  }


  // =========================================================
  // ACCESS TOKEN
  // =========================================================

  getAccessToken(): string | null {

    return (

      localStorage.getItem(
        'access_token'
      )

      ||

      sessionStorage.getItem(
        'access_token'
      )

    );

  }


  // =========================================================
  // REFRESH TOKEN
  // =========================================================

  getRefreshToken(): string | null {

    return (

      localStorage.getItem(
        'refresh_token'
      )

      ||

      sessionStorage.getItem(
        'refresh_token'
      )

    );

  }


  // =========================================================
  // CONNECTÉ ?
  // =========================================================

  isLoggedIn(): boolean {

    return !!this.getAccessToken();

  }


  // =========================================================
  // REFRESH TOKEN
  // =========================================================

  refreshToken():
    Observable<LoginResponse> {

    const refresh =
      this.getRefreshToken();


    if (!refresh) {

      throw new Error(
        'Refresh token introuvable.'
      );

    }


    return this.http.post<LoginResponse>(

      `${this.apiUrl}token/refresh/`,

      {
        refresh
      }

    ).pipe(

      tap(response => {

        this.updateAccessToken(
          response.access
        );

      })

    );

  }


  // =========================================================
  // METTRE À JOUR ACCESS TOKEN
  // =========================================================

  updateAccessToken(
    access: string
  ): void {


    if (
      localStorage.getItem(
        'refresh_token'
      )
    ) {

      localStorage.setItem(
        'access_token',
        access
      );

      return;

    }


    if (
      sessionStorage.getItem(
        'refresh_token'
      )
    ) {

      sessionStorage.setItem(
        'access_token',
        access
      );

    }

  }

getCurrentUser(): any | null {

  const token = this.getAccessToken();

  if (!token) {
    return null;
  }

  try {

    const payload = JSON.parse(
      atob(
        token.split('.')[1]
      )
    );

    return payload;

  } catch (error) {

    console.error(
      'Impossible de lire le token JWT',
      error
    );

    return null;
  }
}

  // =========================================================
  // DÉCONNEXION
  // =========================================================

  logout(): void {


    localStorage.removeItem(
      'access_token'
    );

    localStorage.removeItem(
      'refresh_token'
    );


    sessionStorage.removeItem(
      'access_token'
    );

    sessionStorage.removeItem(
      'refresh_token'
    );


    this.loggedInSubject.next(
      false
    );

  }

}