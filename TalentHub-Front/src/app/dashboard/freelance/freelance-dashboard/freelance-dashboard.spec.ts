import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceDashboardComponent } from './freelance-dashboard';

import {
  FreelanceDashboardService
} from '../../../services/freelance-dashboard.service';


describe('FreelanceDashboardComponent', () => {

  let component: FreelanceDashboardComponent;
  let fixture: ComponentFixture<FreelanceDashboardComponent>;


  const freelanceDashboardServiceMock = {

    getDashboard: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        FreelanceDashboardComponent
      ],

      providers: [

        {
          provide: FreelanceDashboardService,
          useValue: freelanceDashboardServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        FreelanceDashboardComponent
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
