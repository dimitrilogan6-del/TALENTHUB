import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { CandidatDashboardComponent } from './candidat-dashboard';

import {
  CandidatDashboardService,
  CandidatDashboard
} from '../../../services/candidat-dashboard.service';

import { AuthService } from '../../../services/connexion';

describe('CandidatDashboardComponent', () => {

  let component: CandidatDashboardComponent;
  let fixture: ComponentFixture<CandidatDashboardComponent>;

  // ============================================================
  // MOCK DASHBOARD COMPLET
  // ============================================================

  const dashboardMock: CandidatDashboard = {

    utilisateur: {
      id: 1,
      username: 'testuser',
      prenom: 'Test',
      nom: 'Utilisateur',
      nom_complet: 'Test Utilisateur'
    },

    profil: {
      id: 1,
      photoProfil: null,
      profile_completion: 80
    },

    statistiques: {
      total_candidatures: 5,
      candidatures_en_attente: 2,
      candidatures_presselectionnees: 1,
      candidatures_entretien: 1,
      candidatures_acceptees: 1,
      candidatures_refusees: 0,
      messages_non_lus: 2,
      notifications_non_lues: 3
    },

    candidatures_recentes: [],

    prochain_entretien: null,

    entretiens_a_venir: [],

    messages_non_lus: 2,

    notifications_non_lues: 3
  };

  // ============================================================
  // MOCK DASHBOARD SERVICE
  // ============================================================

  const dashboardServiceMock = {

    getDashboard: () =>
      of(dashboardMock),

    getMessagesNonLus: (
      dashboard: CandidatDashboard
    ) =>
      dashboard.statistiques.messages_non_lus,

    getNotificationsNonLues: (
      dashboard: CandidatDashboard
    ) =>
      dashboard.statistiques.notifications_non_lues,

    getTotalCandidatures: (
      dashboard: CandidatDashboard
    ) =>
      dashboard.statistiques.total_candidatures,

    hasPhoto: (
      dashboard: CandidatDashboard
    ) =>
      !!dashboard.profil.photoProfil,

    getPhotoProfil: (
      dashboard: CandidatDashboard
    ) =>
      dashboard.profil.photoProfil,

    getNomComplet: (
      dashboard: CandidatDashboard
    ) =>
      dashboard.utilisateur.nom_complet || 'Utilisateur',

    getInitiale: (
      dashboard: CandidatDashboard
    ) =>
      (
        dashboard.utilisateur.nom_complet || 'Utilisateur'
      ).charAt(0).toUpperCase()
  };

  // ============================================================
  // MOCK AUTH SERVICE
  // ============================================================

  const authServiceMock = {

    logout: () => {},

    isLoggedIn: () => true
  };

  // ============================================================
  // MOCK ROUTER
  // ============================================================

  const routerMock = {

    navigate: () =>
      Promise.resolve(true)
  };

  // ============================================================
  // CONFIGURATION
  // ============================================================

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        CandidatDashboardComponent
      ],

      providers: [

        {
          provide: CandidatDashboardService,
          useValue: dashboardServiceMock
        },

        {
          provide: AuthService,
          useValue: authServiceMock
        },

        {
          provide: Router,
          useValue: routerMock
        }

      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      CandidatDashboardComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  // ============================================================
  // TEST
  // ============================================================

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
