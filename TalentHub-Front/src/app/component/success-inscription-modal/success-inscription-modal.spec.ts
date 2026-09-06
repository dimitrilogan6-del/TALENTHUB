import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  SuccessInscriptionModalComponent  } from './success-inscription-modal';

describe('SuccessInscriptionModalComponent', () => {
  let component: SuccessInscriptionModalComponent;
  let fixture: ComponentFixture<SuccessInscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessInscriptionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessInscriptionModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
