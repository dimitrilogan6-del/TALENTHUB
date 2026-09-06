import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MissionsRecruteur } from './missions-recruteur';

import {
  MissionRecruteurService
} from '../../../services/mission-recruteur.service';


describe('MissionsRecruteur', () => {

  let component: MissionsRecruteur;
  let fixture: ComponentFixture<MissionsRecruteur>;


  const missionServiceMock = {

    getMesMissions: () => ({
      subscribe: () => {}
    }),

    creerMission: () => ({
      subscribe: () => {}
    }),

    modifierMission: () => ({
      subscribe: () => {}
    }),

    supprimerMission: () => ({
      subscribe: () => {}
    }),

    fermerMission: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        MissionsRecruteur
      ],

      imports: [
        ReactiveFormsModule
      ],

      providers: [

        {
          provide: MissionRecruteurService,
          useValue: missionServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        MissionsRecruteur
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});