import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { EntrepriseService } from './entreprise';

describe('EntrepriseService', () => {
  let service: EntrepriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntrepriseService, provideHttpClient()],
    });
    service = TestBed.inject(EntrepriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});