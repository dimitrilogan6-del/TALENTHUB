import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceDashboardComponent } from './freelance-dashboard';

describe('FreelanceDashboardComponent', () => {
  let component: FreelanceDashboardComponent;
  let fixture: ComponentFixture<FreelanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelanceDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelanceDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
