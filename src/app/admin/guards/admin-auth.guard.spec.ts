import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminAuthGuard } from './admin-auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('adminAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
