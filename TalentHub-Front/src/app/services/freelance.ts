import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FreelanceService {
  // Remplacez l'URL par le lien vers votre API Django
  private apiUrl =  " http://127.0.0.1:8000/api/freelances/freelances/ " 

  constructor(private http: HttpClient) { }

  getFreelances(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}