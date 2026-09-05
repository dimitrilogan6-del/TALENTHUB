import { TestBed } from '@angular/core/testing';

import { RecruteurDashboardService } from './recruteur-dashboard.service';

describe('RecruteurDashboardService', () => {
  let service: RecruteurDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecruteurDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
