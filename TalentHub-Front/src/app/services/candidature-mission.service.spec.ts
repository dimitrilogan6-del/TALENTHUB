import { TestBed } from '@angular/core/testing';

import { CandidatureMissionService } from './candidature-mission.service';

describe('CandidatureMissionService', () => {
  let service: CandidatureMissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatureMissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
