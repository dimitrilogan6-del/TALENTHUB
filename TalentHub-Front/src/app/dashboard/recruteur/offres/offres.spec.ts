import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresRecruteur } from './offres';

describe('OffresRecruteur', () => {
  let component: OffresRecruteur;
  let fixture: ComponentFixture<OffresRecruteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffresRecruteur],
    }).compileComponents();

    fixture = TestBed.createComponent(OffresRecruteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
