import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionComponent } from './connexion';

describe('ConnexionComponent', () => {
  let component: ConnexionComponent;
  let fixture: ComponentFixture<ConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnexionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnexionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
