import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { ConnexionRequiredModalComponent } from './connexion-required-modal';

describe('ConnexionRequiredModalComponent', () => {
  let component: ConnexionRequiredModalComponent;
  let fixture: ComponentFixture<ConnexionRequiredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnexionRequiredModalComponent
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
      ConnexionRequiredModalComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
