import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDetailComponent } from './mission-detail';

describe('MissionDetailComponent', () => {
  let component: MissionDetailComponent;
  let fixture: ComponentFixture<MissionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
