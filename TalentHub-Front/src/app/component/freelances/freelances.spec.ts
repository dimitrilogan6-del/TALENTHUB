import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Freelances } from './freelances';

describe('Freelances', () => {
  let component: Freelances;
  let fixture: ComponentFixture<Freelances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Freelances],
    }).compileComponents();

    fixture = TestBed.createComponent(Freelances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
