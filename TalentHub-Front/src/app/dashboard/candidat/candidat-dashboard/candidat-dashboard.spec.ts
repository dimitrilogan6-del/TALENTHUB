import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatDashboardComponent } from './candidat-dashboard';
import { CandidatDashboardService } from '../../../services/candidat-dashboard.service';
import { AuthService } from '../../../services/connexion';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

describe('CandidatDashboardComponent', () => {

let component: CandidatDashboardComponent;
let fixture: ComponentFixture<CandidatDashboardComponent>;

const dashboardServiceMock = {
getDashboard: () => of({
candidatures_recentes: []
})
};

const authServiceMock = {
logout: () => {}
};

const routerMock = {
navigate: () => Promise.resolve(true)
};

beforeEach(async () => {

await TestBed.configureTestingModule({

  declarations: [
    CandidatDashboardComponent
  ],

  providers: [

    {
      provide: CandidatDashboardService,
      useValue: dashboardServiceMock
    },

    {
      provide: AuthService,
      useValue: authServiceMock
    },

    {
      provide: Router,
      useValue: routerMock
    }

  ]

}).compileComponents();

fixture = TestBed.createComponent(
  CandidatDashboardComponent
);

component = fixture.componentInstance;

fixture.detectChanges();

});

it('should create', () => {

expect(component).toBeTruthy();

});

});
