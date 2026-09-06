import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretiensCandidatComponent } from './entretiens';

describe('EntretiensCandidatComponent', () => {
  let component: EntretiensCandidatComponent;
  let fixture: ComponentFixture<EntretiensCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntretiensCandidatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretiensCandidatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
