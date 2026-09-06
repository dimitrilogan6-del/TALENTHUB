import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MissionDetailComponent } from './mission-detail';

describe('MissionDetailComponent', () => {

  let component: MissionDetailComponent;
  let fixture: ComponentFixture<MissionDetailComponent>;

  const activatedRouteMock = {

    snapshot: {

      paramMap: {

        get: () => null

      }

    }

  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        MissionDetailComponent
      ],

      providers: [

        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        }

      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      MissionDetailComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
