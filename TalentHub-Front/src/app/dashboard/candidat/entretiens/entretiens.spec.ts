import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { EntretiensCandidatComponent } from './entretiens';

describe('EntretiensCandidatComponent', () => {

  let component: EntretiensCandidatComponent;
  let fixture: ComponentFixture<EntretiensCandidatComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        EntretiensCandidatComponent
      ],

      imports: [
        FormsModule
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(
      EntretiensCandidatComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
