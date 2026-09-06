import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { CandidatureModal } from './candidature-modal';

describe('CandidatureModal', () => {

  let component: CandidatureModal;
  let fixture: ComponentFixture<CandidatureModal>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        CandidatureModal
      ],

      imports: [
        MatDialogModule,
        FormsModule
      ],

      providers: [

        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },

        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }

      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      CandidatureModal
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
