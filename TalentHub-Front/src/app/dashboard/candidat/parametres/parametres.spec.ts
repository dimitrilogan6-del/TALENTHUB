import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametresComponent } from './parametres';

describe('ParametresComponent', () => {
  let component: ParametresComponent;
  let fixture: ComponentFixture<ParametresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParametresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParametresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
