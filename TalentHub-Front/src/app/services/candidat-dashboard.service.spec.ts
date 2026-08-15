import { TestBed } from '@angular/core/testing';

import { CandidatDashboardService } from './candidat-dashboard.service';

describe('CandidatDashboardService', () => {
  let service: CandidatDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
