import { TestBed } from '@angular/core/testing';

import { AddclientService } from './addclient.service';

describe('AddclientService', () => {
  let service: AddclientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddclientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
