import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
