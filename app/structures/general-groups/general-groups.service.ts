import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, retryWhen, switchMap } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';
import { delayedRetryStrategy } from '../../shared/util/delayed-retry-strategy';

import { AllowedService } from './model/allowed-service.model';
import { BrandProductGroupServiceId } from './model/brand-product-group-service.model';
import { GeneralGroup, GeneralGroups } from './model/general-groups.model';
import { ServiceService } from '../../services/service/services/service.service';

@Injectable()
export class GeneralGroupsService {
  constructor(private apiService: ApiService, private serviceService: ServiceService) {}

  getAll(): Observable<GeneralGroups> {
    return this.apiService
      .get<GeneralGroups>(this.generalGroupsUrl())
      .pipe(retryWhen(delayedRetryStrategy()));
  }

  get(generalGroupId: string): Observable<GeneralGroup> {
    return this.apiService
      .get<GeneralGroup>(this.generalGroupsUrl() + `/${generalGroupId}`)
      .pipe(retryWhen(delayedRetryStrategy()));
  }

  create(generalGroup: GeneralGroupPostResource): Observable<any> {
    return this.apiService.post(this.generalGroupsUrl(), generalGroup);
  }

  update(generalGroupId: string, generalGroup: GeneralGroupPutResource): Observable<any> {
    return this.apiService.put(this.generalGroupsUrl() + `/${generalGroupId}`, generalGroup);
  }

  getAllowedServices(): Observable<AllowedService[]> {
    return this.apiService
      .get<AllowedServiceResponse>(this.generalGroupsUrl() + `/allowed-services`)
      .pipe(
        retryWhen(delayedRetryStrategy()),
        map((response: AllowedServiceResponse) => response.serviceIds),
        switchMap(serviceIds => {
          const allowedService = serviceIds.map(serviceId => {
            this.serviceService.fetchBy(serviceId);
            return this.serviceService
              .selectBy(serviceId)
              .pipe(map(service => ({ id: service?.id, name: service?.name } as AllowedService)));
          });
          return combineLatest([...allowedService]);
        })
      );
  }

  private generalGroupsUrl(): string {
    return '/structures/api/v1/general-groups';
  }
}

interface AllowedServiceResponse {
  serviceIds: number[];
}

interface GeneralGroupPutResource {
  name: string;
  active: boolean;
  countryId: string;
  members?: string[];
  brandProductGroupServices?: BrandProductGroupServiceId[];
}

interface GeneralGroupPostResource extends GeneralGroupPutResource {
  id: string;
}
