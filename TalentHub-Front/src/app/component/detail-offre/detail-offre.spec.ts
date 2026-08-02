import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOffre } from './detail-offre';

describe('DetailOffre', () => {
  let component: DetailOffre;
  let fixture: ComponentFixture<DetailOffre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailOffre],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailOffre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
