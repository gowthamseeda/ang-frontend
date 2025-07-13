import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MultiOfferedService, OfferedServiceValidity } from '../../validity/validity.model';
import { MultiSelectOfferedServiceIds } from '../../service/models/multi-select.model';

import { OfferedService } from './../offered-service.model';
import { ApiService } from '../../../shared/services/api/api.service';
import { ServiceTranslationResource } from '../../../historization/models/master-data-history-snapshot.model';

const url = '/services/api/v1/business-sites';
const companyUrl = '/services/api/v1/company';

interface OfferedServiceResponse {
  offeredServices: OfferedService[];
}

interface VerifiableServiceResponse {
  serviceId: number,
  name: string,
  translations?: ServiceTranslationResource[]
}

@Injectable({
  providedIn: 'root'
})
export class OfferedServiceDataService {
  constructor(private apiService: ApiService) {}

  get(outletId: string): Observable<OfferedService[]> {
    return this.apiService
      .get<OfferedServiceResponse>(`${url}/${outletId}/services`)
      .pipe(map(response => response?.offeredServices ?? []));
  }

  update(outletId: string, offeredServices: OfferedService[]): Observable<any> {
    return this.apiService.put(`${url}/${outletId}/services`, { offeredServices });
  }

  updateValidities(outletId: string, validities: OfferedServiceValidity[]): Observable<any> {
    return this.apiService.patch(`${url}/${outletId}/services/validities`, {
      offeredServicesValidities: validities
    });
  }

  querySisterOutlet(companyId: string, serviceIds: number[]): Observable<any> {
    return this.apiService.post(`${companyUrl}/${companyId}/servicesbff`, serviceIds);
  }

  updateValiditiesForMultipleOutlets(multiOfferedService: MultiOfferedService[]): Observable<any> {
    return this.apiService.put(`${url}/multi-edit/services`, {
      businessSiteOfferedServices: multiOfferedService
    });
  }

  createOfferedService(selectedOfferedServices: MultiSelectOfferedServiceIds[]): Observable<any> {
    return this.apiService.post(`${url}/services/addOfferedServices`, {
      offeredServices: selectedOfferedServices
    });
  }

  getVerifiableServices(outletId: String): Observable<VerifiableServiceResponse[]> {
    return this.apiService.get(`${url}/${outletId}/verifiable-services`)
  }
}
