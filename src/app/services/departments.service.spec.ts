import { TestBed } from '@angular/core/testing';

import { DepartmentsService } from './departments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],});
    service = TestBed.inject(DepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
