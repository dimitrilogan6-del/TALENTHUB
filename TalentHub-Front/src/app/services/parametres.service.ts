import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  throwError
} from 'rxjs';

import {
  catchError
} from 'rxjs/operators';

import {
  environment
} from '../../environments/environment';


// ==========================================================
// INTERFACE
// ==========================================================

export interface ChangementMotDePasse {

  ancien_mot_de_passe: string;

  nouveau_mot_de_passe: string;

  confirmation_mot_de_passe: string;

}


export interface ReponseMotDePasse {

  message: string;

}


// ==========================================================
// SERVICE
// ==========================================================

@Injectable({
  providedIn: 'root'
})
export class ParametresService {


  private readonly apiUrl =
    `${environment.apiUrl.replace(/\/$/, '')}/changer-mot-de-passe/`;


  constructor(
    private http: HttpClient
  ) {}


  // ========================================================
  // CHANGER MOT DE PASSE
  // ========================================================

  changerMotDePasse(
    data: ChangementMotDePasse
  ): Observable<ReponseMotDePasse> {

    console.log(
      'Changement mot de passe :',
      this.apiUrl
    );

    return this.http.post<ReponseMotDePasse>(
      this.apiUrl,
      data
    ).pipe(

      catchError(
        (error: HttpErrorResponse) => {

          console.error(
            'Erreur changement mot de passe :',
            error
          );

          return throwError(
            () => error
          );

        }
      )

    );

  }

}