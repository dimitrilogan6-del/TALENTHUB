import { Injectable } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';


export interface RegisterRequest {

  username: string;

  email: string;

  password: string;

  first_name: string;

  last_name: string;

  role:
    | 'candidat'
    | 'recruteur'
    | 'freelance';

}


@Injectable({
  providedIn: 'root'
})
export class Register {

  private apiUrl =
    environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // INSCRIPTION
  // ==========================================

  submitInscription(
    userData: RegisterRequest
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}inscription/`,
      userData
    );

  }

}
