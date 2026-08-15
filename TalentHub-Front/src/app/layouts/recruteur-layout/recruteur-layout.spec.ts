import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteurLayout } from './recruteur-layout';

describe('RecruteurLayout', () => {
  let component: RecruteurLayout;
  let fixture: ComponentFixture<RecruteurLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecruteurLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(RecruteurLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
