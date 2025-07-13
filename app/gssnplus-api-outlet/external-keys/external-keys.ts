import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { ApiService } from '../../shared/services/api/api.service';

const url = '/gssnplus-api-outlet/api/v1/external-keys/';

@Injectable()
export class ExternalKeysService {
  constructor(private apiService: ApiService) {}

  getVehicleDestinationKey(): Observable<Blob> {
    return this.apiService.get<Blob>(url + "vehicle-destination-key/export", undefined, 'blob')
  }

  getWholeSaleLogisticNumber(): Observable<Blob> {
    return this.apiService.get<Blob>(url + "wholesale-logistic-number/export", undefined, 'blob')
  }

  getExternalKeys(keyType: string,
                  brand: string,
                  productGroup: string,
                  countryId: string,
                  showAddress:boolean,
                  showCity: boolean,
                  showCountry: boolean,
                  excludeNonExistExternalKey: boolean): Observable<Blob> {
    const payload = {
      externalKey: keyType,
      filterBrand: brand,
      filterProductGroup: productGroup,
      filterCountry: countryId,
      showAddress: showAddress,
      showCity: showCity,
      showCountry: showCountry,
      excludeNonExistExternalKey: excludeNonExistExternalKey
    };
    const fullUrl = `${url}export`
    console.log("fullUrl: " + fullUrl)

    return this.apiService.postBlob(fullUrl, payload);
  }
}
