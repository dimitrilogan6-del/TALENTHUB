import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { EntretiensRecruteur } from './entretiens-recruteur';

describe('EntretiensRecruteur', () => {

  let component: EntretiensRecruteur;
  let fixture: ComponentFixture<EntretiensRecruteur>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        EntretiensRecruteur
      ],

      imports: [
        FormsModule
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      EntretiensRecruteur
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
