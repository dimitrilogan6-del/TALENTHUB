import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCandidaturesComponent } from './mes-candidatures';

describe('MesCandidaturesComponent', () => {
  let component: MesCandidaturesComponent;
  let fixture: ComponentFixture<MesCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MesCandidaturesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MesCandidaturesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
