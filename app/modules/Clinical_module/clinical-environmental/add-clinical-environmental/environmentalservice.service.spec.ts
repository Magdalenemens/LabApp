import { TestBed } from '@angular/core/testing';

import { EnvironmentalserviceService } from './environmentalservice.service';

describe('EnvironmentalserviceService', () => {
  let service: EnvironmentalserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentalserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
