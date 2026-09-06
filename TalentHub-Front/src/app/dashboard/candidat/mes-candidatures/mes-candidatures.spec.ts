import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MesCandidaturesComponent } from './mes-candidatures';

describe('MesCandidaturesComponent', () => {

  let component: MesCandidaturesComponent;
  let fixture: ComponentFixture<MesCandidaturesComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        MesCandidaturesComponent
      ],

      imports: [
        FormsModule
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      MesCandidaturesComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
