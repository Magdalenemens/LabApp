import { TestBed } from '@angular/core/testing';

import { ReferenceRangesService } from './reference-ranges.service';

describe('ReferenceRangesService', () => {
  let service: ReferenceRangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceRangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
