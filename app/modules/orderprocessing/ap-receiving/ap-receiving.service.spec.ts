import { TestBed } from '@angular/core/testing';

import { CytogeneticLoginService } from './cytogenetic-login.service';

describe('CytogeneticLoginService', () => {
  let service: CytogeneticLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CytogeneticLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
