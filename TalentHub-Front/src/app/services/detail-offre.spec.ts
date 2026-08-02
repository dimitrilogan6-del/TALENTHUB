import { TestBed } from '@angular/core/testing';

import { DetailOffre } from './detail-offre';

describe('DetailOffre', () => {
  let service: DetailOffre;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailOffre);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
