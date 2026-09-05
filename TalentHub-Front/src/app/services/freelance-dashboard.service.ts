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


// ========================================================
// UTILISATEUR
// ========================================================

export interface FreelanceUtilisateur {

  id: number;

  username: string;

  prenom: string;

  nom: string;

  nom_complet: string;

  email: string;

}


// ========================================================
// PROFIL FREELANCE
// ========================================================

export interface FreelanceProfil {

  id: number;

  role: string;

  titreProfessionnel: string | null;

  biographie: string | null;

  anneesExperience: number;

  tarifHoraire: number | null;

  deviseTarif: string;

  disponibilite: boolean;

  portfolioUrl: string | null;

  linkedinUrl: string | null;

  githubUrl: string | null;

  telephone: string | null;

  specialite: string | null;

  photoProfil: string | null;

  statut_compte: string;

  profile_completion: number;

}


// ========================================================
// STATISTIQUES FREELANCE
// ========================================================

export interface FreelanceStatistiques {

  // ------------------------------------------------------
  // PROFIL
  // ------------------------------------------------------

  profile_completion: number;

  annees_experience: number;

  disponibilite: boolean;


  // ------------------------------------------------------
  // MISSIONS
  // ------------------------------------------------------

  missions_total?: number;

  missions_en_cours?: number;

  missions_terminees?: number;

  missions_en_attente?: number;


  // ------------------------------------------------------
  // CANDIDATURES
  // ------------------------------------------------------

  candidatures_total?: number;

  candidatures_en_attente?: number;

  candidatures_acceptees?: number;

  candidatures_refusees?: number;


  // ------------------------------------------------------
  // SERVICES
  // ------------------------------------------------------

  services_total?: number;

  services_actifs?: number;

  services_inactifs?: number;


  // ------------------------------------------------------
  // REVENUS
  // ------------------------------------------------------

  revenus_total?: number;

  revenus_mois?: number;

  revenus_en_attente?: number;


  // ------------------------------------------------------
  // COMMUNICATION
  // ------------------------------------------------------

  messages_non_lus?: number;

  notifications_non_lues?: number;

}


// ========================================================
// MISSION
// ========================================================

export interface FreelanceMission {

  id: number;

  titre: string;

  description?: string | null;

  entreprise?: string | null;

  statut?: string | null;

  montant?: number | null;

  dateDebut?: string | null;

  dateFin?: string | null;

  created_at?: string | null;

}


// ========================================================
// CANDIDATURE
// ========================================================

export interface FreelanceCandidature {

  id: number;

  offre_id?: number;

  offre_titre?: string;

  entreprise?: string;

  statut?: string;

  date_candidature?: string;

}


// ========================================================
// SERVICE / COMPÉTENCE
// ========================================================

export interface FreelanceServiceItem {

  id: number;

  titre?: string;

  description?: string;

  tarif?: number;

  devise?: string;

  statut?: string;

}


// ========================================================
// DASHBOARD COMPLET
// ========================================================

export interface FreelanceDashboard {

  utilisateur: FreelanceUtilisateur;

  profil: FreelanceProfil;

  statistiques: FreelanceStatistiques;


  // ------------------------------------------------------
  // DONNÉES RÉCENTES
  // ------------------------------------------------------

  missions_recentes?: FreelanceMission[];

  candidatures_recentes?: FreelanceCandidature[];

  services_recents?: FreelanceServiceItem[];

}


// ========================================================
// SERVICE ANGULAR
// ========================================================

@Injectable({
  providedIn: 'root'
})
export class FreelanceDashboardService {


  // ======================================================
  // URL API
  // ======================================================

  private apiUrl =
    environment.apiUrl +
    'freelance/dashboard/';


  // ======================================================
  // CONSTRUCTEUR
  // ======================================================

  constructor(
    private http: HttpClient
  ) {}


  // ======================================================
  // RÉCUPÉRER LE DASHBOARD
  // ======================================================

  getDashboard():
    Observable<FreelanceDashboard> {

    return this.http.get<FreelanceDashboard>(
      this.apiUrl
    );

  }


  // ======================================================
  // RECHARGER LE DASHBOARD
  // ======================================================

  reloadDashboard():
    Observable<FreelanceDashboard> {

    return this.getDashboard();

  }

}