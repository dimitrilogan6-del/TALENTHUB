import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Offre
} from '../models/offre.model';

import {
  environment
} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OffreService {

  // =====================================================
  // URL DE L'API
  // =====================================================

  private apiUrl =
    environment.apiUrl +
    'offres/offres/';


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // RÉCUPÉRER TOUTES LES OFFRES
  // =====================================================

  getOffres(): Observable<Offre[]> {

    return this.http.get<Offre[]>(
      this.apiUrl
    );

  }


  // =====================================================
  // RÉCUPÉRER UNE OFFRE
  // =====================================================

  getOffreById(
    id: number
  ): Observable<Offre> {

    return this.http.get<Offre>(
      `${this.apiUrl}${id}/`
    );

  }

}