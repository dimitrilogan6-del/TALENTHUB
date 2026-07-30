import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatureModal } from './candidature-modal';

describe('CandidatureModal', () => {
  let component: CandidatureModal;
  let fixture: ComponentFixture<CandidatureModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatureModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatureModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
