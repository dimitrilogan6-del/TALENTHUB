import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatPage } from './candidat-page';

describe('CandidatPage', () => {
  let component: CandidatPage;
  let fixture: ComponentFixture<CandidatPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
