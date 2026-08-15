import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';


export interface Freelance {

  id: number;


  user: {

    id: number;

    username: string;

    first_name: string;

    last_name: string;

    email: string;

  };


  nom_complet: string;


  titreProfessionnel: string | null;

  specialite: string | null;

  biographie: string | null;


  photoProfil: string | null;


  anneesExperience: number;


  tarifHoraire: number | null;

  deviseTarif: string;


  disponibilite: boolean;


  portfolioUrl: string | null;

  linkedinUrl: string | null;

  githubUrl: string | null;


  profile_completion: number;

}


@Injectable({
  providedIn: 'root'
})
export class FreelanceService {

  private apiUrl =
    environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  getFreelances():
    Observable<Freelance[]> {

    console.log(
      'GET :',
      `${this.apiUrl}freelances/`
    );


    return this.http.get<Freelance[]>(
      `${this.apiUrl}freelances/`
    );

  }

}