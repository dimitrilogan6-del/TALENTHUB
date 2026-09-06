import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PublicLayout } from './public-layout';

@Component({
  selector: 'app-header',
  standalone: false,
  template: ''
})
class MockHeaderComponent {}

@Component({
  selector: 'app-footer',
  standalone: false,
  template: ''
})
class MockFooterComponent {}

describe('PublicLayout', () => {
  let component: PublicLayout;
  let fixture: ComponentFixture<PublicLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PublicLayout,
        MockHeaderComponent,
        MockFooterComponent
      ],
      imports: [
        RouterModule.forRoot([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLayout);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
