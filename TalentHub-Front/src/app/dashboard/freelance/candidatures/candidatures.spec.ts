import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesFreelance } from './candidatures';

import { CandidaturesFreelances } from '../../../services/candidatures-freelance';


describe('CandidaturesFreelance', () => {

  let component: CandidaturesFreelance;
  let fixture: ComponentFixture<CandidaturesFreelance>;


  const candidaturesServiceMock = {

    getCandidatures: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        CandidaturesFreelance
      ],

      providers: [

        {
          provide: CandidaturesFreelances,
          useValue: candidaturesServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        CandidaturesFreelance
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
