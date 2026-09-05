import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceDashboard } from './freelance-dashboard';

describe('FreelanceDashboard', () => {
  let component: FreelanceDashboard;
  let fixture: ComponentFixture<FreelanceDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelanceDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelanceDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
