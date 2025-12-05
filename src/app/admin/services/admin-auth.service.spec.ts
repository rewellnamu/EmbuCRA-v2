import { TestBed } from '@angular/core/testing';

import { AdminAuthService } from './admin-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminAuthService', () => {
  let service: AdminAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],});
    service = TestBed.inject(AdminAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
