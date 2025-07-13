import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ComparableAddress } from '../../../google/map-message/comparable-address.model';
import { ApiService } from '../../../shared/services/api/api.service';
import { CustomEncoder } from '../../../shared/services/api/custom-encoder';
import { isGPSProblemCountry } from '../gps-problem-countries';
import {
  LocationAddressRequestParams,
  LocationCoordinatesRequestParams,
  LocationResponse
} from '../models/location-api';
import { Location } from '../models/location.model';

const geoCodeUrl = '/legal-structure/api/v1/location';

@Injectable()
export class LocationApiService {
  private defaultLanguageId = 'en';

  constructor(private apiService: ApiService) {}

  getLocationForAddress(address: ComparableAddress, languageId?: string): Observable<Location> {
    const params: LocationAddressRequestParams = {
      countryId: address.country ?? '',
      city: address.city ?? '',
      street: address.street,
      streetNumber: address.streetNumber,
      zipCode: address.zipCode,
      language: languageId ?? this.defaultLanguageId
    };

    return this.apiService
      .get<LocationResponse>(geoCodeUrl + '/byAddress', this.buildAddressParams(params))
      .pipe(
        map(response => {
          const geoLocation: Location = {
            address: {
              countryId: response.countryId ?? '',
              city: response.city,
              street: response.street,
              streetNumber: response.streetNumber,
              zipCode: response.zipCode
            }
          };

          if (response.state || response.province) {
            geoLocation.region = {
              state: response.state,
              province: response.province
            };
          }

          if (!isGPSProblemCountry(response.countryId) && response.latitude && response.longitude) {
            geoLocation.gps = {
              latitude: response.latitude.toFixed(6),
              longitude: response.longitude.toFixed(6)
            };
          }
          return geoLocation;
        })
      );
  }

  getLocationForGps(
    latitude: string,
    longitude: string,
    languageId?: string
  ): Observable<Location> {
    const params: LocationCoordinatesRequestParams = {
      latitude: latitude,
      longitude: longitude,
      language: languageId ?? this.defaultLanguageId
    };

    return this.apiService
      .get<LocationResponse>(geoCodeUrl + '/byCoordinates', this.buildCoordinatesParams(params))
      .pipe(
        map(response => {
          const geoLocation: Location = {
            address: {
              countryId: response.countryId ?? '',
              city: response.city,
              street: response.street,
              streetNumber: response.streetNumber,
              zipCode: response.zipCode
            }
          };

          if (response.state || response.province) {
            geoLocation.region = {
              state: response.state,
              province: response.province
            };
          }

          if (response.latitude && response.longitude) {
            geoLocation.gps = {
              latitude: response.latitude.toFixed(6),
              longitude: response.longitude.toFixed(6)
            };
          }
          return geoLocation;
        })
      );
  }

  private buildAddressParams(params: LocationAddressRequestParams): HttpParams {
    let httpParams = new HttpParams({ encoder: new CustomEncoder() });
    httpParams = httpParams.append('countryId', params.countryId).append('city', params.city);

    if (params.language) {
      httpParams = httpParams.append('language', params.language);
    }
    if (params.street) {
      httpParams = httpParams.append('street', params.street);
    }
    if (params.streetNumber) {
      httpParams = httpParams.append('streetNumber', params.streetNumber);
    }
    if (params.zipCode) {
      httpParams = httpParams.append('zipCode', params.zipCode);
    }
    return httpParams;
  }

  private buildCoordinatesParams(params: LocationCoordinatesRequestParams): HttpParams {
    let httpParams = new HttpParams({ encoder: new CustomEncoder() });
    httpParams = httpParams
      .append('latitude', params.latitude)
      .append('longitude', params.longitude);

    if (params.language) {
      httpParams = httpParams.append('language', params.language);
    }
    return httpParams;
  }
}
