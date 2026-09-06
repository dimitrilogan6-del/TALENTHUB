import { ComponentFixture, TestBed } from '@angular/core/testing';
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
        MatDialogModule
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

    fixture = TestBed.createComponent(CandidatureModal);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
