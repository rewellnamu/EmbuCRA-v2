import { TestBed } from '@angular/core/testing';

import { TendersService } from './tenders.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TendersService', () => {
  let service: TendersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],});
    service = TestBed.inject(TendersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
