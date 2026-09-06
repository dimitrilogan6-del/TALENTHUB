import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceProfilComponent } from './profil';

describe('FreelanceProfilComponent', () => {
  let component: FreelanceProfilComponent;
  let fixture: ComponentFixture<FreelanceProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelanceProfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FreelanceProfilComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
