import { TestBed } from '@angular/core/testing';

import { CandidaturesRecruteurService } from './candidatures-recruteur.service';

describe('CandidaturesRecruteurService', () => {
  let service: CandidaturesRecruteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidaturesRecruteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
