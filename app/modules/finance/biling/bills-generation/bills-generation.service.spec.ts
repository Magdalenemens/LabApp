import { TestBed } from '@angular/core/testing';

import { BillsGenerationService } from './bills-generation.service';

describe('BillsGenerationService', () => {
  let service: BillsGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillsGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
