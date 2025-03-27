import { TestBed } from '@angular/core/testing';

import { mniService } from './mni.service';


describe('MniService', () => {
  let service: mniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(mniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
