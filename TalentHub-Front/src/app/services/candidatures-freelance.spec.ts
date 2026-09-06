import { TestBed } from '@angular/core/testing';

import { CandidaturesFreelances } from './candidatures-freelance';

describe('CandidaturesFreelances', () => {
  let service: CandidaturesFreelances;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidaturesFreelances);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
