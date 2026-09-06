import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsComponent } from './missions';

describe('MissionsComponent', () => {
  let component: MissionsComponent;
  let fixture: ComponentFixture<MissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
