import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import {
  BusinessSiteCountryStructureResource,
  CountryStructureResource
} from '../model/country-structure-api.model';

const url = '/structures/api/v1/country-structures/business-sites';

@Injectable()
export class CountryStructureApiService {
  constructor(private apiService: ApiService) {}

  getCountryStructureBy(businessSiteId: string): Observable<CountryStructureResource> {
    return this.apiService.get<CountryStructureResource>(url + '/' + businessSiteId);
  }

  updateCountryStructureWith(
    businessSiteId: string,
    resource: BusinessSiteCountryStructureResource
  ): Observable<any> {
    return this.apiService.put(url + '/' + businessSiteId, { ...resource });
  }
}
