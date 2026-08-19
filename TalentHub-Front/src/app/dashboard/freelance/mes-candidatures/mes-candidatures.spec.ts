import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCandidatures } from './mes-candidatures';

describe('MesCandidatures', () => {
  let component: MesCandidatures;
  let fixture: ComponentFixture<MesCandidatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MesCandidatures],
    }).compileComponents();

    fixture = TestBed.createComponent(MesCandidatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
