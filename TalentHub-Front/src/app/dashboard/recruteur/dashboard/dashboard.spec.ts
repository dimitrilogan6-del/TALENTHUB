import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecruteur } from './dashboard';

describe('DashboardRecruteurComponent', () => {
  let component: DashboardRecruteur;
  let fixture: ComponentFixture<DashboardRecruteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardRecruteur],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRecruteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
