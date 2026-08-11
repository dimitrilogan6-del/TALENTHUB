import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Entreprise } from './entreprise';
import { EntrepriseService } from '../../services/entreprise';

describe('EntrepriseComponent', () => {
  let component: Entreprise;
  let fixture: ComponentFixture<Entreprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entreprise],
      providers: [
        EntrepriseService,
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Entreprise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
