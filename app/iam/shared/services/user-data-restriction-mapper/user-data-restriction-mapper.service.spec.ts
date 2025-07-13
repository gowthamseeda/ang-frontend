import { TestBed } from '@angular/core/testing';

import { getUserDataRestrictionsResponseMock } from '../../../user-data-restrictions/services/user-data-restrictions/user-data-restrictions.mock';

import { UserDataRestrictionMapperService } from './user-data-restriction-mapper.service';

describe('UserDataRestrictionMapperService', () => {
  let service: UserDataRestrictionMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataRestrictionMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDataRestrictionValues', () => {
    it('should convert to string array', done => {
      const mock = getUserDataRestrictionsResponseMock();
      const expected = service.getDataRestrictionValues(
        mock.assignedDataRestrictions,
        'ProductGroup'
      );

      expect(expected).toEqual(['BUS']);
      done();
    });
  });
});
