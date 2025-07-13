import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../../testing/testing.module';

import {
  getUserDataRestrictionsMock,
  getUserDataRestrictionsResponseMock
} from './user-data-restrictions.mock';
import { UpdateUserDataRestrictions } from './user-data-restrictions.model';
import { UserDataRestrictionsService } from './user-data-restrictions.service';

describe('UserDataRestrictionsService', () => {
  let service: UserDataRestrictionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, UserDataRestrictionsService]
    });
    service = TestBed.inject(UserDataRestrictionsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return the data restrictions for the given user', done => {
      service.get('HANS').subscribe(userDataRestrictions => {
        expect(userDataRestrictions).toEqual(getUserDataRestrictionsResponseMock());
        done();
      });
    });
  });

  describe('update', () => {
    it('should update the data restrictions for the given user', done => {
      let updated = false;
      const userDataRestrictions: UpdateUserDataRestrictions = {
        tenantIds: ['GSSNPLUS'],
        languageIds: ['fr-FR'],
        countryIds: ['FR'],
        brandIds: ['SMT'],
        productGroupIds: ['BUS'],
        distributionLevelIds: ['RETAILER'],
        businessSiteIds: ['GS1234567'],
        serviceIds: ['801'],
        ignoreFocusProductGroup: false
      };
      service.update(getUserDataRestrictionsMock().userId, userDataRestrictions).subscribe(() => {
        updated = true;
      });
      expect(updated).toBeTruthy();
      done();
    });
  });
});
