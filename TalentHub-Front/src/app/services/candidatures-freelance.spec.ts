import { TestBed } from '@angular/core/testing';

import { CandidaturesFreelance } from './candidatures-freelance';

describe('CandidaturesFreelance', () => {
  let service: CandidaturesFreelance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidaturesFreelance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
