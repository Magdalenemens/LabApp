import { TestBed } from '@angular/core/testing';

import { AddTestDirectoryService } from './add-test-directory.service';

describe('AddTestDirectoryService', () => {
  let service: AddTestDirectoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTestDirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
