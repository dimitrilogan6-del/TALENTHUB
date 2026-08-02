import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInscriptionModal } from './success-inscription-modal';

describe('SuccessInscriptionModal', () => {
  let component: SuccessInscriptionModal;
  let fixture: ComponentFixture<SuccessInscriptionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessInscriptionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessInscriptionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
