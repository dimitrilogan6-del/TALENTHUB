import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceLayoutComponent } from './freelance-layout';

describe('FreelanceLayoutComponent', () => {
  let component: FreelanceLayoutComponent;
  let fixture: ComponentFixture<FreelanceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelanceLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelanceLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
