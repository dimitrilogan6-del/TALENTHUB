import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatDashboardComponent } from './candidat-dashboard';

describe('CandidatDashboardComponent', () => {
  let component: CandidatDashboardComponent;
  let fixture: ComponentFixture<CandidatDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatDashboardComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
