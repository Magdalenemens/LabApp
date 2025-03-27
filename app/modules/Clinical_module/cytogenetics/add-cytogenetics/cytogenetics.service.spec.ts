import { TestBed } from '@angular/core/testing';

import { CytogeneticsService } from './cytogenetics.service';

describe('CytogeneticsService', () => {
  let service: CytogeneticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CytogeneticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
