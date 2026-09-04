import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsRecruteur } from './missions-recruteur';

describe('MissionsRecruteur', () => {
  let component: MissionsRecruteur;
  let fixture: ComponentFixture<MissionsRecruteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionsRecruteur],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionsRecruteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
