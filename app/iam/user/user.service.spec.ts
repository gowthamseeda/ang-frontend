import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective, NgxPermissionsService } from 'ngx-permissions';
import { of } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { UserDataRestrictions } from './user.model';
import {getUserMock, getUserMockWithEncodedPermission} from './user.mock';
import { UserService } from './user.service';

describe('UserService', () => {
  const userMock = getUserMock();
  const userMockWithEncodedPermission = getUserMockWithEncodedPermission();
  let service: UserService;
  let apiService: ApiService;
  let permissionServiceSpy: Spy<NgxPermissionsService>;

  beforeEach(() => {
    permissionServiceSpy = createSpyFromClass(NgxPermissionsService);
    TestBed.configureTestingModule({
      declarations: [NgxPermissionsAllowStubDirective],
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        UserService,
        { provide: NgxPermissionsService, useValue: permissionServiceSpy }
      ]
    });

    service = TestBed.inject(UserService);
    apiService = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('loadUser()', () => {
    it('should load permissions into permission service', done => {
      expect(permissionServiceSpy.loadPermissions).toHaveBeenCalled();
      done();
    });
  });

  describe('getCurrent()', () => {
    it('should return a valid user', done => {
      service.getCurrent().subscribe(user => {
        expect(user).toEqual(userMock);
        done();
      });
    });
  });

  describe('getPermissions()', () => {
    it('should return the permissions of a valid user', done => {
      service.getPermissions().subscribe(permissions => {
        expect(permissions).toEqual(userMock.permissions);
        done();
      });
    });

    it('should return no permissions because of invalid user', done => {
      jest.spyOn(apiService, 'get').mockReturnValue(of(null));
      service.loadUser();

      service.getPermissions().subscribe(permissions => {
        expect(permissions).toEqual([]);
        done();
      });
    });
  });

  describe('getRoles()', () => {
    it('should return the roles of a valid user', done => {
      service.getRoles().subscribe(roles => {
        expect(roles).toEqual(userMock.roles);
        done();
      });
    });

    it('should return no roles because of invalid user', done => {
      jest.spyOn(apiService, 'get').mockReturnValue(of(null));
      service.loadUser();

      service.getRoles().subscribe(roles => {
        expect(roles).toEqual([]);
        done();
      });
    });
  });

  describe('getUserDataRestrictions()', () => {
    it('should return the data restrictions of a valid user', done => {
      service.getUserDataRestrictions().subscribe(userDataRestrictions => {
        expect(userDataRestrictions).toEqual(userMock.dataRestrictions);
        done();
      });
    });

    it('should return no data restrictions cause of invalid user', done => {
      jest.spyOn(apiService, 'get').mockReturnValue(of(null));
      service.loadUser();

      service.getUserDataRestrictions().subscribe(userDataRestrictions => {
        expect(userDataRestrictions).toEqual(new UserDataRestrictions());
        done();
      });
    });
  });

  describe('getBusinessSiteRestrictions()', () => {
    it('should return empty country restrictions when there are none', done => {
      jest.spyOn(service, 'getUserDataRestrictions').mockReturnValue(of({}));

      service.getCountryRestrictions().subscribe(countryRestrictions => {
        expect(countryRestrictions).toEqual([]);
        done();
      });
    });
  });

  describe('getCountryRestrictions()', () => {
    it('should return the country restrictions', done => {
      service.getCountryRestrictions().subscribe(countryRestrictions => {
        expect(countryRestrictions).toEqual(userMock.dataRestrictions.Country);
        done();
      });
    });

    it('should return empty country restrictions when there are none', done => {
      jest.spyOn(service, 'getUserDataRestrictions').mockReturnValue(of({}));

      service.getCountryRestrictions().subscribe(countryRestrictions => {
        expect(countryRestrictions).toEqual([]);
        done();
      });
    });
  });

  describe('getBrandRestrictions()', () => {
    it('should return the brand restrictions', done => {
      service.getBrandRestrictions().subscribe(brandRestrictions => {
        expect(brandRestrictions).toEqual(userMock.dataRestrictions.Brand);
        done();
      });
    });

    it('should return empty brand restrictions when there are none', done => {
      jest.spyOn(service, 'getUserDataRestrictions').mockReturnValue(of({}));

      service.getBrandRestrictions().subscribe(brandRestrictions => {
        expect(brandRestrictions).toEqual([]);
        done();
      });
    });
  });

  describe('getProductGroupRestrictions()', () => {
    it('should return the product group restrictions', done => {
      service.getProductGroupRestrictions().subscribe(productGroupRestrictions => {
        expect(productGroupRestrictions).toEqual(userMock.dataRestrictions.ProductGroup);
        done();
      });
    });

    it('should return empty product group restrictions when there are none', done => {
      jest.spyOn(service, 'getUserDataRestrictions').mockReturnValue(of({}));

      service.getProductGroupRestrictions().subscribe(productGroupRestrictions => {
        expect(productGroupRestrictions).toEqual([]);
        done();
      });
    });
  });

  describe('encoding and decoding to the string given', () => {
    it('should decode the string given using Base64 decoding function', done => {
      const encodedString = 'dGVzdEFCQzEyMw==';
      // Decode the String
      const decodedString = atob(encodedString);
      expect(decodedString).toEqual('testABC123');
      done();
    });

    it('should encode the string given using Base64 encoding function', done => {
      const decodedString = 'testABC123';
      // Encode the String
      const encodedString = btoa(decodedString);
      expect(encodedString).toEqual('dGVzdEFCQzEyMw==');
      done();
    });

    it('should decode the array of permission given using Base64 decoding function', done => {
      const userMockWithDecodedPermission = service.decodePermission(userMockWithEncodedPermission);
      const permissions = ['geography.language.create', 'geography.language.read']

      expect(permissions).toEqual(userMockWithDecodedPermission?.permissions);
      done();
    });
  });
});
