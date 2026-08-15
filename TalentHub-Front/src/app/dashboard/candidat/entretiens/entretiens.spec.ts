import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entretiens } from './entretiens';

describe('Entretiens', () => {
  let component: Entretiens;
  let fixture: ComponentFixture<Entretiens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Entretiens],
    }).compileComponents();

    fixture = TestBed.createComponent(Entretiens);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
