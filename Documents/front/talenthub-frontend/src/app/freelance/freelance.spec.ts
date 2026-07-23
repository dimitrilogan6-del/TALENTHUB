import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Freelance } from './freelance';

describe('Freelance', () => {
  let component: Freelance;
  let fixture: ComponentFixture<Freelance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Freelance],
    }).compileComponents();

    fixture = TestBed.createComponent(Freelance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
