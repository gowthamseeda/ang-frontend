import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck } from 'rxjs/operators';

import { ComparableAddress } from '../../../google/map-message/comparable-address.model';
import { MismatchAddress } from '../../../google/map-message/mismatch-address.model';
import { Location, LocationGps, LocationRegion } from '../models/location.model';

import { LocationApiService } from './location-api.service';

interface LocationState {
  location: Location;
  translatedLocation: Location;
}

const emptyLocation: Location = {
  address: {
    countryId: ''
  }
};

const defaultState: LocationState = {
  location: {
    ...emptyLocation
  },
  translatedLocation: {
    ...emptyLocation
  }
};

@Injectable()
export class LocationService {
  private subject = new BehaviorSubject<LocationState>(defaultState);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());
  private mismatchAddress = new Subject<MismatchAddress | null>();

  constructor(private geocodeService: LocationApiService) {}

  selectRegion(): Observable<LocationRegion | undefined> {
    return this.store.pipe(pluck('location'), pluck('region'));
  }

  selectTranslatedRegion(): Observable<LocationRegion | undefined> {
    return this.store.pipe(pluck('translatedLocation'), pluck('region'));
  }

  selectGpsCoordinates(): Observable<LocationGps | undefined> {
    return this.store.pipe(pluck('location'), pluck('gps'));
  }

  getMismatchAddress(): Observable<MismatchAddress | null> {
    return this.mismatchAddress.asObservable();
  }

  updateLocationDataInStoreFor(address: ComparableAddress): void {
    if (!address.country || !address.city) {
      return;
    }

    this.mismatchAddress.next(null);
    this.geocodeService.getLocationForAddress(address).subscribe(
      geoLocation => {
        if (geoLocation) {
          this.subject.next({
            ...this.subject.value,
            location: geoLocation
          });
        } else {
          this.subject.next({
            ...this.subject.value,
            location: { ...emptyLocation }
          });
        }
      },
      () => {
        this.subject.next({
          ...this.subject.value,
          location: { ...emptyLocation }
        });
      }
    );
  }

  updateTranslatedLocationDataInStoreFor(address: ComparableAddress, languageId?: string): void {
    this.geocodeService
      .getLocationForAddress(address, languageId)
      .pipe(filter(geoLocation => geoLocation !== undefined))
      .subscribe(geoLocation => {
        this.subject.next({
          ...this.subject.value,
          translatedLocation: geoLocation
        });
      });
  }

  compareLocationsAddressAndUpdateMismatch(
    latitude: string,
    longitude: string,
    previousAddress: ComparableAddress
  ): void {
    this.geocodeService
      .getLocationForGps(latitude, longitude)
      .pipe(
        map(
          location =>
            new ComparableAddress(
              location.address.streetNumber,
              location.address.street,
              location.address.city,
              location.address.countryId,
              location.address.zipCode
            )
        ),
        map(comparableLocationAddress => {
          const isMismatch = comparableLocationAddress.checkForMatchWith(previousAddress);
          return isMismatch ? comparableLocationAddress.mismatchAddress : null;
        })
      )
      .subscribe(addressMismatch => {
        this.mismatchAddress.next(addressMismatch);
      });
  }

  resetState(): void {
    this.subject.next(defaultState);
  }
}
