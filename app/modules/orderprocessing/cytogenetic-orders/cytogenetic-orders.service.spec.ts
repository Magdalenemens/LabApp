import { TestBed } from '@angular/core/testing';

import { CytogeneticOrdersService } from './cytogenetic-orders.service';

describe('CytogeneticOrdersService', () => {
  let service: CytogeneticOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CytogeneticOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
