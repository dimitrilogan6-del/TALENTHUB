import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionRequiredModal } from './connexion-required-modal';

describe('ConnexionRequiredModal', () => {
  let component: ConnexionRequiredModal;
  let fixture: ComponentFixture<ConnexionRequiredModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnexionRequiredModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnexionRequiredModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
