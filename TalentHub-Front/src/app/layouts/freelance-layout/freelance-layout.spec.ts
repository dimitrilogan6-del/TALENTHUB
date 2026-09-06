import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { FreelanceLayoutComponent } from './freelance-layout';
import { FreelanceDashboardService } from '../../services/freelance-dashboard.service';
import { AuthService } from '../../services/auth';

describe('FreelanceLayoutComponent', () => {
  let component: FreelanceLayoutComponent;
  let fixture: ComponentFixture<FreelanceLayoutComponent>;

  const freelanceDashboardServiceMock = {
    getDashboard: () => of({
      utilisateur: {
        nom_complet: 'Freelance Test',
        prenom: 'Freelance',
        email: 'test@example.com'
      },
      profil: {
        titreProfessionnel: 'Développeur',
        photoProfil: null,
        disponibilite: true,
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
        FreelanceLayoutComponent
      ],

      imports: [
        RouterModule.forRoot([])
      ],

      providers: [
        {
          provide: FreelanceDashboardService,
          useValue: freelanceDashboardServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FreelanceLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
