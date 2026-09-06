import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecruteur } from './dashboard';

import {
  RecruteurDashboardService
} from '../../../services/recruteur-dashboard.service';


describe('DashboardRecruteurComponent', () => {

  let component: DashboardRecruteur;
  let fixture: ComponentFixture<DashboardRecruteur>;


  const dashboardServiceMock = {

    getDashboard: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        DashboardRecruteur
      ],

      providers: [

        {
          provide: RecruteurDashboardService,
          useValue: dashboardServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        DashboardRecruteur
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
