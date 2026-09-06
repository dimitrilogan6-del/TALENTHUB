import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
  });

  it('should be created', () => {
    const guard = TestBed.inject(AuthGuard);

    expect(guard).toBeTruthy();
  });

});
