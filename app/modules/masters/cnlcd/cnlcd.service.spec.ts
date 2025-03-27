import { TestBed } from '@angular/core/testing';

import { CnlcdService } from './cnlcd.service';

describe('CnlcdService', () => {
  let service: CnlcdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CnlcdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
