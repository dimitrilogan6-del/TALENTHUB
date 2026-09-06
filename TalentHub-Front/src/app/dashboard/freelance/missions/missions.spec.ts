import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MissionsComponent } from './missions';

describe('MissionsComponent', () => {

  let component: MissionsComponent;
  let fixture: ComponentFixture<MissionsComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        MissionsComponent
      ],

      imports: [
        FormsModule
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      MissionsComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
