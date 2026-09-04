import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesRecruteur } from './candidatures-recruteur';

describe('CandidaturesRecruteur', () => {
  let component: CandidaturesRecruteur;
  let fixture: ComponentFixture<CandidaturesRecruteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidaturesRecruteur],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidaturesRecruteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
