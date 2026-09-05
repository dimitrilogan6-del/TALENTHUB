import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsRectuteur } from './missions-rectuteur';

describe('MissionsRectuteur', () => {
  let component: MissionsRectuteur;
  let fixture: ComponentFixture<MissionsRectuteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionsRectuteur],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionsRectuteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
