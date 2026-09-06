import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ParametresComponent } from './parametres';

describe('ParametresComponent', () => {

  let component: ParametresComponent;
  let fixture: ComponentFixture<ParametresComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        ParametresComponent
      ],

      imports: [
        FormsModule
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      ParametresComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
