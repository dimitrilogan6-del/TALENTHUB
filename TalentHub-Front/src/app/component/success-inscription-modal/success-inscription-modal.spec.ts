import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { SuccessInscriptionModalComponent } from './success-inscription-modal';

describe('SuccessInscriptionModalComponent', () => {
  let component: SuccessInscriptionModalComponent;
  let fixture: ComponentFixture<SuccessInscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SuccessInscriptionModalComponent
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

    fixture = TestBed.createComponent(
      SuccessInscriptionModalComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
