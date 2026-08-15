import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceLayout } from './freelance-layout';

describe('FreelanceLayout', () => {
  let component: FreelanceLayout;
  let fixture: ComponentFixture<FreelanceLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelanceLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelanceLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
