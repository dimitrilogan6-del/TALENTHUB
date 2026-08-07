import { TestBed } from '@angular/core/testing';

import { Connexion } from './connexion';

describe('Connexion', () => {
  let service: Connexion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Connexion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
