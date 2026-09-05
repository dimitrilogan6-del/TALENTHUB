import { TestBed } from '@angular/core/testing';

import { MissionRecruteurService } from './mission-recruteur.service';

describe('MissionRecruteurService', () => {
  let service: MissionRecruteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionRecruteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
