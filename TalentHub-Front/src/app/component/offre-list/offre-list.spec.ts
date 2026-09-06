import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { OffreList } from './offre-list';

describe('OffreList', () => {
  let component: OffreList;
  let fixture: ComponentFixture<OffreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OffreList
      ],

      imports: [
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OffreList);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
