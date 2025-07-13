import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ComparableAddress } from '../../../google/map-message/comparable-address.model';
import { ApiService } from '../../../shared/services/api/api.service';
import { Location } from '../models/location.model';
import { LocationResponse } from '../models/location-api';
import { getLocationApiMock } from '../models/location-api.mock';
import { getLocationMock } from '../models/location.mock';

import { LocationApiService } from './location-api.service';

describe('LocationApiService Test', () => {
  let service: LocationApiService;
  let apiServiceSpy: Spy<ApiService>;
  const locationApiResponseMock = getLocationApiMock();
  const locationMock = getLocationMock();

  beforeEach(() => {
    apiServiceSpy = createSpyFromClass(ApiService);

    TestBed.configureTestingModule({
      imports: [],
      providers: [LocationApiService, { provide: ApiService, useValue: apiServiceSpy }]
    });
    service = TestBed.inject(LocationApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getLocationForAddress should', () => {
    const anyAddress = new ComparableAddress();

    it('return all location data in correct object structure if present', done => {
      apiServiceSpy.get.nextWith(locationApiResponseMock);
      const expected: Location = {
        ...locationMock
      };

      service.getLocationForAddress(anyAddress).subscribe(response => {
        expect(response).toStrictEqual(expected);
        done();
      });
    });

    it('return location data without gps if country is ProblemCountry (China)', done => {
      const locationResponseMock_ProblemCountry: LocationResponse = {
        ...locationApiResponseMock,
        countryId: 'CN'
      };

      apiServiceSpy.get.nextWith(locationResponseMock_ProblemCountry);
      const expected: Location = {
        address: {
          countryId: 'CN',
          city: 'Berlin',
          street: 'Leipziger Street',
          streetNumber: '1',
          zipCode: '10117'
        },
        region: {
          province: 'province',
          state: 'state'
        }
      };

      service.getLocationForAddress(anyAddress).subscribe(response => {
        expect(response).toStrictEqual(expected);
        done();
      });
    });
  });

  describe('getLocationForGps should', () => {
    it('return all location data in correct object structure if present', done => {
      apiServiceSpy.get.nextWith(locationApiResponseMock);
      const expected: Location = {
        ...locationMock
      };

      service.getLocationForGps('anyLat', 'anyLong').subscribe(response => {
        expect(response).toStrictEqual(expected);
        done();
      });
    });
  });
});
