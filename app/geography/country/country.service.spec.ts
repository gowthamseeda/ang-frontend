import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { getCountriesMock, getUserDataRestrictedCountryMock } from './country.mock';
import { CountryService } from './country.service';
import { UserService } from '../../iam/user/user.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsService } from 'ngx-permissions';

describe('CountryService', () => {
  const userDataRestrictedCountryMock = getUserDataRestrictedCountryMock();
  const countryMock = getCountriesMock();
  let service: CountryService;
  let permissionServiceSpy: Spy<NgxPermissionsService>;

  beforeEach(() => {
    permissionServiceSpy = createSpyFromClass(NgxPermissionsService);
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        CountryService,
        UserService,
        { provide: NgxPermissionsService, useValue: permissionServiceSpy }
      ]
    });
    service = TestBed.inject(CountryService);
  });

  it('should create ', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all countries from the geography contract', done => {
      service.getAll().subscribe(countries => {
        expect(countries).toEqual(countryMock.countries);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get a specific country from the geography contract ', done => {
      service.get('GB').subscribe(country => {
        expect(country).toEqual(countryMock.countries[0]);
        done();
      });
    });
  });

  describe('getAllForUserDataRestrictions()', () => {
    it('should get all countries from the geography contract', done => {
      service.getAllForUserDataRestrictions().subscribe(countries => {
        expect(countries).toEqual(userDataRestrictedCountryMock.countries);
        done();
      });
    });
  });
});
