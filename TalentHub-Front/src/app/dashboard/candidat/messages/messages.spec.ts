import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Messages } from './messages';

describe('Messages', () => {
  let component: Messages;
  let fixture: ComponentFixture<Messages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Messages],
    }).compileComponents();

    fixture = TestBed.createComponent(Messages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
