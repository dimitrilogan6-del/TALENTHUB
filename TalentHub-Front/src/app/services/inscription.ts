import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InscriptionData } from '../models/inscription';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = 'http://127.0.0.1:8000/api/inscription/';
  private inscriptionData: Partial<InscriptionData> = {};

  constructor(private http: HttpClient) {}

  updateStepData(stepData: Partial<InscriptionData>): void {
    this.inscriptionData = { ...this.inscriptionData, ...stepData };
  }

  getCurrentData(): Partial<InscriptionData> {
    return this.inscriptionData;
  }

  submitInscription(): Observable<any> {
    const data = this.inscriptionData as any;
    
    // 1. Vérification stricte des champs obligatoires pour Django
    if (!data.email || !data.password) {
      throw new Error('L\'email et le mot de passe sont obligatoires.');
    }

    // 2. Construire le payload (AVEC DES VALEURS PAR DÉFAUT SÛRES)
    const payload = {
      username: data.email,           // L'email sert de username
      email: data.email,
      password: data.password,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: data.role || 'candidat',
      telephone: data.telephone || '',
      numCni: data.numCni || '',
      dateNaissance: data.dateNaissance ||  null,
      lieuNaissance: data.lieuNaissance || '',
      sexe: data.sexe || '',
      nationalite: data.nationalite || '',
      niveauEtude: data.niveauEtude || '',
      specialite: data.specialite || '',
      statut: 'Actif',
      dernierDiplome: data.dernierDiplome || '',
      dateObtentionDiplome: data.dateObtentionDiplome ||  null,
      numPassport: data.numPassport || '',
      dateEmbauche: data.dateEmbauche || null,
    };

    // 3. Envoyer à Django (ne jamais envoyer de chaînes vides pour les champs obligatoires)
    return this.http.post(this.apiUrl, payload);
  }
}