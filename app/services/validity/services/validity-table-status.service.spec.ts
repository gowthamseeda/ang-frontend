import { TestBed } from '@angular/core/testing';

import { ValidityTableStatusService } from './validity-table-status.service';

describe('ValidityTableStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidityTableStatusService = TestBed.inject(ValidityTableStatusService);
    expect(service).toBeTruthy();
  });
});
