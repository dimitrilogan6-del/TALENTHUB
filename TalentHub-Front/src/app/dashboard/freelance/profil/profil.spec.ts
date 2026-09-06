import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceProfilComponent } from './profil';

import { ProfilService } from '../../../services/profil';


describe('FreelanceProfilComponent', () => {

  let component: FreelanceProfilComponent;
  let fixture: ComponentFixture<FreelanceProfilComponent>;


  const profilServiceMock = {

    getMonProfil: () => ({
      subscribe: () => {}
    }),

    updateProfil: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        FreelanceProfilComponent
      ],

      providers: [

        {
          provide: ProfilService,
          useValue: profilServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        FreelanceProfilComponent
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
