import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatLayoutComponent } from './candidat-layout';

describe('CandidatLayoutComponent', () => {
  let component: CandidatLayoutComponent;
  let fixture: ComponentFixture<CandidatLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
