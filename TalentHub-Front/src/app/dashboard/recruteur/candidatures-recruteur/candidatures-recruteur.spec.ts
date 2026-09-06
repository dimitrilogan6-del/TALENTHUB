import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CandidaturesRecruteur } from './candidatures-recruteur';

describe('CandidaturesRecruteur', () => {

  let component: CandidaturesRecruteur;
  let fixture: ComponentFixture<CandidaturesRecruteur>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        CandidaturesRecruteur
      ],

      imports: [
        FormsModule
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      CandidaturesRecruteur
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
