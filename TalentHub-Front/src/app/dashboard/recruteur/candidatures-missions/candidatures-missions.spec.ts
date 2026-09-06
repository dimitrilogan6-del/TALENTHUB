import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesMissions } from './candidatures-missions';

import {
  CandidatureMissionService
} from '../../../services/candidature-mission.service';


describe('CandidaturesMissions', () => {

  let component: CandidaturesMissions;
  let fixture: ComponentFixture<CandidaturesMissions>;


  const candidatureServiceMock = {

    getCandidatures: () => ({
      subscribe: () => {}
    }),

    accepter: () => ({
      subscribe: () => {}
    }),

    refuser: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        CandidaturesMissions
      ],

      providers: [

        {
          provide: CandidatureMissionService,
          useValue: candidatureServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        CandidaturesMissions
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
