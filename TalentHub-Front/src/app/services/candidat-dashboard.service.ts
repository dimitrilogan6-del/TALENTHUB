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
  catchError,
  tap
} from 'rxjs/operators';

import {
  environment
} from '../../environments/environment';


// ==========================================================
// UTILISATEUR
// ==========================================================

export interface UtilisateurDashboard {

  id?: number;

  username: string;

  prenom?: string;

  nom?: string;

  nom_complet?: string;

}


// ==========================================================
// PROFIL
// ==========================================================

export interface ProfilDashboard {

  id?: number;

  photoProfil?: string | null;

  profile_completion: number;

}


// ==========================================================
// STATISTIQUES
// ==========================================================

export interface StatistiquesDashboard {

  // --------------------------------------------------------
  // CANDIDATURES
  // --------------------------------------------------------

  total_candidatures: number;

  candidatures_en_attente: number;

  candidatures_presselectionnees: number;

  candidatures_entretien: number;

  candidatures_acceptees: number;

  candidatures_refusees: number;


  // --------------------------------------------------------
  // MESSAGES
  // --------------------------------------------------------

  messages_non_lus: number;


  // --------------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------------

  notifications_non_lues: number;

}


// ==========================================================
// CANDIDATURE RÉCENTE
// ==========================================================

export interface CandidatureRecente {

  offre_id: number;

  titre_offre: string;

  entreprise: string;

  date: string;

  statut: string;

}


// ==========================================================
// ENTRETIEN
// ==========================================================

export interface Entretien {

  id?: number;

  titre_offre: string;

  entreprise: string;

  dateHeure: string;

  statut: string;

  type: string;

  lieu?: string | null;

  lienVisio?: string | null;

}


// ==========================================================
// DASHBOARD COMPLET
// ==========================================================
export interface CandidatDashboard {

  utilisateur: UtilisateurDashboard;

  profil: ProfilDashboard;

  statistiques: StatistiquesDashboard;

  candidatures_recentes:
    CandidatureRecente[];

  prochain_entretien:
    Entretien | null;

  entretiens_a_venir:
    Entretien[];

  messages_non_lus:
    number;

  notifications_non_lues:
    number;

}

export interface StatistiquesDashboard {

  total_candidatures: number;

  candidatures_en_attente: number;

  candidatures_presselectionnees: number;

  candidatures_entretien: number;

  candidatures_acceptees: number;

  candidatures_refusees: number;

  messages_non_lus: number;

  notifications_non_lues: number;

}

// ==========================================================
// SERVICE
// ==========================================================

@Injectable({
  providedIn: 'root'
})
export class CandidatDashboardService {


  // ========================================================
  // URL API
  // ========================================================

  private readonly apiUrl =
    `${environment.apiUrl.replace(/\/+$/, '')}/candidat/dashboard/`;


  // ========================================================
  // CONSTRUCTEUR
  // ========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ========================================================
  // RÉCUPÉRER LE DASHBOARD
  // ========================================================

  getDashboard(): Observable<CandidatDashboard> {

    console.log(
      '======================================'
    );

    console.log(
      '📊 APPEL API DASHBOARD CANDIDAT'
    );

    console.log(
      'URL :',
      this.apiUrl
    );

    console.log(
      '======================================'
    );


    return this.http
      .get<CandidatDashboard>(
        this.apiUrl
      )
      .pipe(

        tap(
          (data) => {

            console.log(
              '======================================'
            );

            console.log(
              '✅ DASHBOARD CANDIDAT REÇU'
            );

            console.log(
              'Utilisateur :',
              data.utilisateur
            );

            console.log(
              'Profil :',
              data.profil
            );

            console.log(
              'Statistiques :',
              data.statistiques
            );

            console.log(
              'Photo profil :',
              data.profil?.photoProfil
            );

            console.log(
              'Messages non lus :',
              data.messages_non_lus
            );

            console.log(
              'Notifications non lues :',
              data.statistiques?.notifications_non_lues
            );

            console.log(
              'Candidatures :',
              data.candidatures_recentes
            );

            console.log(
              'Prochain entretien :',
              data.prochain_entretien
            );

            console.log(
              'Entretiens à venir :',
              data.entretiens_a_venir
            );

            console.log(
              '======================================'
            );

          }
        ),

        catchError(
          (error: HttpErrorResponse) => {

            console.error(
              '======================================'
            );

            console.error(
              '❌ ERREUR DASHBOARD CANDIDAT'
            );

            console.error(
              'URL :',
              this.apiUrl
            );

            console.error(
              'Status :',
              error.status
            );

            console.error(
              'Status text :',
              error.statusText
            );

            console.error(
              'Message :',
              error.message
            );

            console.error(
              'Erreur serveur :',
              error.error
            );

            console.error(
              'Erreur complète :',
              error
            );

            console.error(
              '======================================'
            );

            return throwError(
              () => error
            );

          }
        )

      );

  }


  // ========================================================
  // RACCOURCI : NOMBRE DE MESSAGES NON LUS
  // ========================================================

  getMessagesNonLus(
    dashboard: CandidatDashboard
  ): number {

    return (
      dashboard?.statistiques?.messages_non_lus ?? 0
    );

  }


  // ========================================================
  // RACCOURCI : NOMBRE DE NOTIFICATIONS NON LUES
  // ========================================================

  getNotificationsNonLues(
    dashboard: CandidatDashboard
  ): number {

    return (
      dashboard?.statistiques?.notifications_non_lues ?? 0
    );

  }


  // ========================================================
  // RACCOURCI : NOMBRE DE CANDIDATURES
  // ========================================================

  getTotalCandidatures(
    dashboard: CandidatDashboard
  ): number {

    return (
      dashboard?.statistiques?.total_candidatures ?? 0
    );

  }


  // ========================================================
  // VÉRIFIER SI LE PROFIL POSSÈDE UNE PHOTO
  // ========================================================

  hasPhoto(
    dashboard: CandidatDashboard
  ): boolean {

    return !!(
      dashboard?.profil?.photoProfil
    );

  }


  // ========================================================
  // RÉCUPÉRER LA PHOTO
  // ========================================================

  getPhotoProfil(
    dashboard: CandidatDashboard
  ): string | null {

    return (
      dashboard?.profil?.photoProfil ?? null
    );

  }


  // ========================================================
  // RÉCUPÉRER LE NOM COMPLET
  // ========================================================

  getNomComplet(
    dashboard: CandidatDashboard
  ): string {

    if (
      dashboard?.utilisateur?.nom_complet
    ) {

      return dashboard.utilisateur.nom_complet;

    }


    const prenom =
      dashboard?.utilisateur?.prenom ?? '';

    const nom =
      dashboard?.utilisateur?.nom ?? '';


    const nomComplet =
      `${prenom} ${nom}`.trim();


    if (nomComplet) {

      return nomComplet;

    }


    return (
      dashboard?.utilisateur?.username ??
      'Utilisateur'
    );

  }


  // ========================================================
  // RÉCUPÉRER L'INITIAL DU NOM
  // ========================================================

  getInitiale(
    dashboard: CandidatDashboard
  ): string {

    const nom =
      this.getNomComplet(
        dashboard
      );


    return (
      nom
        .charAt(0)
        .toUpperCase()
    );

  }

}