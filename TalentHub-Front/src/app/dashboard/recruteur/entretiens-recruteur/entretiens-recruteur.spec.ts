import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretiensRecruteur } from './entretiens-recruteur';

describe('EntretiensRecruteur', () => {
  let component: EntretiensRecruteur;
  let fixture: ComponentFixture<EntretiensRecruteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntretiensRecruteur],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretiensRecruteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
