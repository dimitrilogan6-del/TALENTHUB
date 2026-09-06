import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesFreelance } from './candidatures';

describe('CandidaturesFreelance', () => {
  let component: CandidaturesFreelance;
  let fixture: ComponentFixture<CandidaturesFreelance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidaturesFreelance],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidaturesFreelance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
