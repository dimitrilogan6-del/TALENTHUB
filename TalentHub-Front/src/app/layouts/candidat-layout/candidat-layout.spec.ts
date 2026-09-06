import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { CandidatLayoutComponent } from './candidat-layout';
import { CandidatDashboardService } from '../../services/candidat-dashboard.service';
import { AuthService } from '../../services/auth';

describe('CandidatLayoutComponent', () => {
  let component: CandidatLayoutComponent;
  let fixture: ComponentFixture<CandidatLayoutComponent>;

  const dashboardServiceMock = {
    getDashboard: () => of({
      statistiques: {
        total_candidatures: 0,
        messages_non_lus: 0,
        notifications_non_lues: 0
      },
      utilisateur: {
        nom_complet: 'Utilisateur Test',
        prenom: 'Utilisateur',
        nom: 'Test',
        username: 'test'
      },
      profil: {
        photoProfil: null,
        profile_completion: 0
      }
    })
  };

  const authServiceMock = {
    logout: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CandidatLayoutComponent
      ],

      imports: [
        RouterModule.forRoot([])
      ],

      providers: [
        {
          provide: CandidatDashboardService,
          useValue: dashboardServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
