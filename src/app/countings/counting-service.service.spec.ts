import { TestBed } from '@angular/core/testing';

import { CountingService } from './counting-service.service';

describe('CountingServiceService', () => {
  let service: CountingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
