import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ComparableAddress } from '../../../google/map-message/comparable-address.model';
import { getComparableAddressSwitzerlandMock } from '../../../google/map-message/comparable-address.mock';
import { getLocationMock } from '../models/location.mock';

import { LocationApiService } from './location-api.service';
import { LocationService } from './location-service.model';

describe('LocationService Test Suite', () => {
  let service: LocationService;
  let locationApiServiceSpy: Spy<LocationApiService>;
  const locationMock = getLocationMock();

  beforeEach(() => {
    locationApiServiceSpy = createSpyFromClass(LocationApiService);

    TestBed.configureTestingModule({
      providers: [LocationService, { provide: LocationApiService, useValue: locationApiServiceSpy }]
    });
    service = TestBed.inject(LocationService);
  });

  describe('initialization with empty state', () => {
    it('selectRegion should emit undefined after initialization', done => {
      service.selectRegion().subscribe(region => {
        expect(region).toBeUndefined();
        done();
      });
    });

    it('selectTranslatedRegion should emit undefined after initialization', done => {
      service.selectTranslatedRegion().subscribe(region => {
        expect(region).toBeUndefined();
        done();
      });
    });

    it('selectGpsCoordinates should emit undefined after initialization', done => {
      service.selectGpsCoordinates().subscribe(region => {
        expect(region).toBeUndefined();
        done();
      });
    });
  });

  describe('updateTranslatedLocationDataInStoreFor', () => {
    const anyAddress = new ComparableAddress();

    it('selectTranslatedRegion should emit region data', done => {
      locationApiServiceSpy.getLocationForAddress.nextWith(locationMock);

      service.updateTranslatedLocationDataInStoreFor(anyAddress);

      service.selectTranslatedRegion().subscribe(region => {
        expect(region).toStrictEqual(locationMock.region);
        done();
      });
    });
  });

  describe('updateLocationDataInStoreFor', () => {
    const validAddress = getComparableAddressSwitzerlandMock();

    it('selectGpsCoordinates should emit region data', done => {
      locationApiServiceSpy.getLocationForAddress.nextWith(locationMock);

      service.updateLocationDataInStoreFor(validAddress);

      service.selectGpsCoordinates().subscribe(gps => {
        expect(gps).toStrictEqual(locationMock.gps);
        done();
      });
    });

    it('selectRegion should emit region data', done => {
      locationApiServiceSpy.getLocationForAddress.nextWith(locationMock);

      service.updateLocationDataInStoreFor(validAddress);

      service.selectRegion().subscribe(region => {
        expect(region).toStrictEqual(locationMock.region);
        done();
      });
    });

    it('selectRegion should emit undefined on error', done => {
      locationApiServiceSpy.getLocationForAddress.throwWith('error');

      service.updateLocationDataInStoreFor(validAddress);

      service.selectRegion().subscribe(region => {
        expect(region).toBeUndefined();
        done();
      });
    });

    it('selectRegion should emit undefined if no location', done => {
      locationApiServiceSpy.getLocationForAddress.nextWith(undefined);

      service.updateLocationDataInStoreFor(validAddress);

      service.selectRegion().subscribe(region => {
        expect(region).toBeUndefined();
        done();
      });
    });
  });
});
