import { TestBed } from '@angular/core/testing';

import { NumericRefernceRangeService } from './numeric-refernce-range.service';

describe('NumericRefernceRangeService', () => {
  let service: NumericRefernceRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumericRefernceRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
