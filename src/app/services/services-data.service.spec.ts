import { TestBed } from '@angular/core/testing';

import { ServicesDataService } from './services-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ServicesDataService', () => {
  let service: ServicesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],});
    service = TestBed.inject(ServicesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
