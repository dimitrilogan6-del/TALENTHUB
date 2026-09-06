import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ConnexionComponent } from './connexion';

import { AuthService } from '../../services/connexion';
import { ProfilService } from '../../services/profil';
import { SessionService } from '../../services/session';

describe('ConnexionComponent', () => {
  let component: ConnexionComponent;
  let fixture: ComponentFixture<ConnexionComponent>;

  // ============================================================
  // MOCK AUTH SERVICE
  // ============================================================

  const authServiceMock = {
    isLoggedIn: () => false,

    login: () =>
      of({
        access: 'fake-access-token',
        refresh: 'fake-refresh-token'
      }),

    saveTokens: (
      access: string,
      refresh: string,
      rememberMe: boolean
    ) => {}
  };

  // ============================================================
  // MOCK PROFIL SERVICE
  // ============================================================

  const profilServiceMock = {
    getMonProfil: () =>
      of({
        est_admin: false,
        role: 'candidat'
      })
  };

  // ============================================================
  // MOCK SESSION SERVICE
  // ============================================================

  const sessionServiceMock = {
    setProfil: (profil: any) => {}
  };

  // ============================================================
  // MOCK ROUTER
  // ============================================================

  const routerMock = {
    navigate: () => Promise.resolve(true)
  };

  // ============================================================
  // INITIALISATION
  // ============================================================

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnexionComponent
      ],

      imports: [
        FormsModule
      ],

      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: ProfilService,
          useValue: profilServiceMock
        },
        {
          provide: SessionService,
          useValue: sessionServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnexionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // TEST DE CRÉATION
  // ============================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
