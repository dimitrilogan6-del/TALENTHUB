
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { SuccessModalComponent } from './success-modal';

describe('SuccessModalComponent', () => {
  let component: SuccessModalComponent;
  let fixture: ComponentFixture<SuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SuccessModalComponent
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

    fixture = TestBed.createComponent(SuccessModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
