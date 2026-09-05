import { TestBed } from '@angular/core/testing';

import { FreelanceDashboardService } from './freelance-dashboard.service';

describe('FreelanceDashboardService', () => {
  let service: FreelanceDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreelanceDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
