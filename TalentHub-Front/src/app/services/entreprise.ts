import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  private apiUrl =
    environment.apiUrl + 'offres/entreprises/';

  constructor(
    private http: HttpClient
  ) {}

  getEntreprises(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );

  }

  getEntrepriseById(id: number): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}${id}/`
    );

  }
}