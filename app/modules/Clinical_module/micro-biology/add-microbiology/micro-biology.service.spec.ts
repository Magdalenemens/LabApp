import { TestBed } from '@angular/core/testing';

import { MicroBiologyService } from './micro-biology.service';

describe('MicroBiologyService', () => {
  let service: MicroBiologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroBiologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
