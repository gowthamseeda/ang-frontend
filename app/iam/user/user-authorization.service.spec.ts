import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';

import { UserAuthorizationService } from './user-authorization.service';
import { UserService } from './user.service';

describe('UserAuthorizationService', () => {
  let service: UserAuthorizationService;
  let userServiceSpy: Spy<UserService>;
  let apiServiceSpy: Spy<ApiService>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getPermissions.nextWith([]);
    userServiceSpy.getCountryRestrictions.nextWith([]);
    userServiceSpy.getBrandRestrictions.nextWith([]);
    userServiceSpy.getProductGroupRestrictions.nextWith([]);
    userServiceSpy.getDistributionLevelRestrictions.nextWith([]);
    apiServiceSpy = createSpyFromClass(ApiService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        LoggingService,
        UserAuthorizationService,
        {
          provide: UserService,
          useValue: userServiceSpy
        }
      ]
    });

    service = TestBed.inject(UserAuthorizationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthorizedFor', () => {
    it('should return false when no condition is added', done => {
      service.isAuthorizedFor.verify().subscribe(assertion => {
        expect(assertion).toBeFalsy();
        done();
      });
    });

    it('should return true when two conditions are true', done => {
      service.isAuthorizedFor
        .permissions([])
        .country('')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should return false when one of many conditions is false', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith(['XX']);

      service.isAuthorizedFor
        .permissions([])
        .country('')
        .brand('')
        .productGroup('PC')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('permissions', () => {
    it('should be false when user has no permissions', done => {
      userServiceSpy.getPermissions.nextWith([]);

      service.isAuthorizedFor
        .permissions(['write'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
    it('should be true when user has the given permissions', done => {
      userServiceSpy.getPermissions.nextWith(['write']);

      service.isAuthorizedFor
        .permissions(['write'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not the given permissions', done => {
      userServiceSpy.getPermissions.nextWith(['read']);

      service.isAuthorizedFor
        .permissions(['write'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });

    it('should be true when the user has all given permissions', done => {
      userServiceSpy.getPermissions.nextWith(['read', 'write']);

      service.isAuthorizedFor
        .permissions(['read', 'write'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not all given permissions', done => {
      userServiceSpy.getPermissions.nextWith(['read']);

      service.isAuthorizedFor
        .permissions(['read', 'write'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('businessSite', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getBusinessSiteRestrictions.nextWith([]);

      service.isAuthorizedFor
        .businessSite('GS00000001')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has the given restriction', done => {
      userServiceSpy.getBusinessSiteRestrictions.nextWith(['GS00000001']);

      service.isAuthorizedFor
        .businessSite('GS00000001')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not the given restriction', done => {
      userServiceSpy.getBusinessSiteRestrictions.nextWith(['XX']);

      service.isAuthorizedFor
        .businessSite('GS00000001')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('country', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getCountryRestrictions.nextWith([]);

      service.isAuthorizedFor
        .country('DE')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has the given restriction', done => {
      userServiceSpy.getCountryRestrictions.nextWith(['DE']);

      service.isAuthorizedFor
        .country('DE')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not the given restriction', done => {
      userServiceSpy.getCountryRestrictions.nextWith(['XX']);

      service.isAuthorizedFor
        .country('DE')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('observableCountry', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getCountryRestrictions.nextWith([]);

      service.isAuthorizedFor
        .observableCountry(of('DE'))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has the given restriction', done => {
      userServiceSpy.getCountryRestrictions.nextWith(['DE']);

      service.isAuthorizedFor
        .observableCountry(of('DE'))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not the given restriction', done => {
      userServiceSpy.getCountryRestrictions.nextWith(['XX']);

      service.isAuthorizedFor
        .observableCountry(of('DE'))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('brand', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getBrandRestrictions.nextWith([]);

      service.isAuthorizedFor
        .brand('MB')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has the given restriction', done => {
      userServiceSpy.getBrandRestrictions.nextWith(['MB']);

      service.isAuthorizedFor
        .brand('MB')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not the given restriction', done => {
      userServiceSpy.getBrandRestrictions.nextWith(['XX']);

      service.isAuthorizedFor
        .brand('MB')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('productGroup', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith([]);

      service.isAuthorizedFor
        .productGroup('PC')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has the given restriction', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith(['PC']);

      service.isAuthorizedFor
        .productGroup('PC')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has not the given restriction', done => {
      userServiceSpy.getProductGroupRestrictions.nextWith(['XX']);

      service.isAuthorizedFor
        .productGroup('PC')
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('distributionLevels', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith([]);

      service.isAuthorizedFor
        .distributionLevels(['RETAILER'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has all of the given restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith(['RETAILER']);

      service.isAuthorizedFor
        .distributionLevels(['RETAILER'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be true when the user has one of the given restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith(['WHOLESALER']);

      service.isAuthorizedFor
        .distributionLevels(['RETAILER', 'WHOLESALER'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has none the given restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith(['WHOLESALER']);

      service.isAuthorizedFor
        .distributionLevels(['RETAILER'])
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });

  describe('observableDistributionLevels', () => {
    it('should be true when user has no restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith([]);

      service.isAuthorizedFor
        .observableDistributionLevels(of(['RETAILER']))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });
    it('should be true when user has all of the given restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith(['RETAILER']);

      service.isAuthorizedFor
        .observableDistributionLevels(of(['RETAILER']))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be true when the user has one of the given restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith(['WHOLESALER']);

      service.isAuthorizedFor
        .observableDistributionLevels(of(['RETAILER', 'WHOLESALER']))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeTruthy();
          done();
        });
    });

    it('should be false when the user has none the given restrictions', done => {
      userServiceSpy.getDistributionLevelRestrictions.nextWith(['WHOLESALER']);

      service.isAuthorizedFor
        .observableDistributionLevels(of(['RETAILER']))
        .verify()
        .subscribe(assertion => {
          expect(assertion).toBeFalsy();
          done();
        });
    });
  });
});
