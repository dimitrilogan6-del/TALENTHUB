import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionRequiredModalComponent } from './connexion-required-modal';

describe('ConnexionRequiredModalComponent', () => {
  let component: ConnexionRequiredModalComponent;
  let fixture: ComponentFixture<ConnexionRequiredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnexionRequiredModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnexionRequiredModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
