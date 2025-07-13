import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServiceVariant } from './../service-variant.model';
import { ApiService } from '../../../shared/services/api/api.service';

const byBusinessSiteUrl = '/services/api/v1/servicevariants/business-sites';
const byCountryUrl = '/services/api/v1/servicevariants/countries';

interface ServiceVariantResponse {
  serviceVariants: ServiceVariant[];
}

@Injectable()
export class ServiceVariantDataService {
  // See Story: https://shared-jira.mercedes-benz.polygran.de/browse/GSSNPLUS-7809
  private productCategoryId = 1;

  constructor(private apiService: ApiService) {}

  getAllForServiceByBusinessSiteId(businessSiteId: string): Observable<ServiceVariant[]> {
    return this.apiService
      .get<ServiceVariantResponse>(
        byBusinessSiteUrl + `/${businessSiteId}`,
        this.getServiceVariantForStructureQueryParams(this.productCategoryId)
      )
      .pipe(map(response => response.serviceVariants));
  }

  getAllForStructureBy(countryId: string): Observable<ServiceVariant[]> {
    return this.apiService
      .get<ServiceVariantResponse>(
        byCountryUrl + `/${countryId}`,
        this.getServiceVariantForStructureQueryParams(this.productCategoryId)
      )
      .pipe(map(response => response.serviceVariants));
  }

  private getServiceVariantForStructureQueryParams(productCategoryId: number): HttpParams {
    return new HttpParams().append('productCategoryId', String(productCategoryId));
  }
}
