import { TestBed } from '@angular/core/testing';

import { DownloadsService } from './downloads.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DownloadsService', () => {
  let service: DownloadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],});
    service = TestBed.inject(DownloadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
