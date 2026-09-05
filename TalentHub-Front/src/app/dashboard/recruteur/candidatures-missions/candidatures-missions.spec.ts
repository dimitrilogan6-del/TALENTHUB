import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesMissions } from './candidatures-missions';

describe('CandidaturesMissions', () => {
  let component: CandidaturesMissions;
  let fixture: ComponentFixture<CandidaturesMissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidaturesMissions],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidaturesMissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
