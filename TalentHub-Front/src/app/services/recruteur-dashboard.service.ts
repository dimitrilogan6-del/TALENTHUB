import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StatistiquesRecruteur {
  offres_total: number;
  offres_publiees: number;
  offres_brouillons: number;
  offres_suspendues: number;
  offres_fermees: number;

  candidatures_total: number;
  candidatures_attente: number;
  candidatures_preselectionnees: number;
  candidatures_entretien: number;
  candidatures_acceptees: number;
  candidatures_refusees: number;

  entretiens_planifies: number;
  entretiens_confirmes: number;
  entretiens_a_venir: number;

  messages_non_lus: number;
  notifications_non_lues: number;
}

export interface UtilisateurRecruteur {
  id: number;
  username: string;
  prenom: string;
  nom: string;
  nom_complet: string;
  email: string;
}

export interface ProfilRecruteur {
  id: number;
  fonction: string | null;
  telephone: string | null;
  statut_recruteur: string | null;
  photoProfil: string | null;
  profile_completion: number;
}

export interface EntrepriseRecruteur {
  id: number;
  nom: string;
  secteur: string | null;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  siteweb: string | null;
  description: string | null;
  logo: string | null;
  statut: string;
  verifiee: boolean;
}

export interface OffreRecente {
  id: number;
  titre: string;
  typeOffre: string;
  statut: string;
  localisation: string | null;
  datePublication: string | null;
  dateLimite: string | null;
  nombre_candidatures: number;
}

export interface CandidatureMatching {
  id: number;
  candidat_id: number;

  nom: string;
  email: string;
  photoProfil: string | null;

  offre_id: number;
  offre: string;

  statut: string;
  dateSoumission: string;

  score_matching: number;

  details_matching: {
    competences: number;
    experience: number;
    specialite: number;
    niveau_etude: number;
    profil: number;
  };

  competences_correspondantes: {
    nom: string;
    niveau_requis: string;
    niveau_candidat: string;
    correspond: boolean;
  }[];

  competences_manquantes: string[];

  specialite: string | null;
  experience: number;
  niveauEtude: string | null;
  profile_completion: number;
}

export interface EntretienRecruteur {
  id: number;
  candidat: string;
  offre: string;
  dateHeure: string;
  type: string;
  statut: string;
  reponseCandidat: string;
  lieu: string | null;
  lienVisio: string | null;
}

export interface RecruteurDashboard {
  utilisateur: UtilisateurRecruteur;
  profil: ProfilRecruteur;
  entreprise: EntrepriseRecruteur | null;

  statistiques: StatistiquesRecruteur;

  offres_recentes: OffreRecente[];

  candidatures_recentes: CandidatureMatching[];

  top_candidats: CandidatureMatching[];

  entretiens: EntretienRecruteur[];
}

@Injectable({
  providedIn: 'root'
})
export class RecruteurDashboardService {


  private readonly apiUrl =
    `${environment.apiUrl.replace(/\/+$/, '')}`;


  constructor(
    private http: HttpClient
  ) {}

  getDashboard(): Observable<RecruteurDashboard> {

    return this.http.get<RecruteurDashboard>(
      `${this.apiUrl}/recruteur/dashboard/`
    );
  }
}