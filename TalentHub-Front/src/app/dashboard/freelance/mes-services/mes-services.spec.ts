import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesServices } from './mes-services';

describe('MesServices', () => {
  let component: MesServices;
  let fixture: ComponentFixture<MesServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MesServices],
    }).compileComponents();

    fixture = TestBed.createComponent(MesServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
