import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatLayout } from './candidat-layout';

describe('CandidatLayout', () => {
  let component: CandidatLayout;
  let fixture: ComponentFixture<CandidatLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
