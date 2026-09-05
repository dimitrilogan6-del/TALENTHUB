import { TestBed } from '@angular/core/testing';

import { RecruteurOffresService } from './recruteur-offres.service';

describe('RecruteurOffresService', () => {
  let service: RecruteurOffresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecruteurOffresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
