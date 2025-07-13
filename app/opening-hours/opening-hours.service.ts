import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskData } from 'app/tasks/task.model';
import { Observable } from 'rxjs';
import { retryWhen } from 'rxjs/operators';

import { ApiService } from '../shared/services/api/api.service';
import { CustomEncoder } from '../shared/services/api/custom-encoder';
import { ObjectStatus } from '../shared/services/api/objectstatus.model';
import { delayedRetryStrategy } from '../shared/util/delayed-retry-strategy';

import { OpeningHourConvertion } from './brand-product-group/brand-product-group-opening-hours';
import { Response } from './models/opening-hour-response.model';
import { SpecialOpeningHour, StandardOpeningHour } from './models/opening-hour.model';
import { Hours, Service } from './store/reducers';
import { MultiSelectOfferedServiceIds } from '../services/service/models/multi-select.model';

export interface updateOpeningHoursByOfferedServiceIdResponse {
  fail: OpeningHourUpdateStatusItem[];
  success: OpeningHourUpdateStatusItem[];
}

export interface OpeningHourUpdateStatusItem {
  offeredServiceId: String;
  openingHour: OpeningHoursDayResource;
  message: String[] | null;
  startDate: String | null;
  endDate: String | null;
}

export interface OpeningHoursDayResource {
  day: String;
  closed: Boolean;
  times: OpeningHoursResource[];
}

export interface OpeningHoursResource {
  begin: String;
  end: String;
}

@Injectable()
export class OpeningHoursService {
  createAndGetUrl = '/opening-hours/api/v1/opening-hours/bff/business-sites/';
  updateUrl = '/opening-hours/api/v1/opening-hours/bff/business-sites/';
  url = '/opening-hours/api/v1/opening-hours/offered-service';

  constructor(private apiService: ApiService) {}

  getExistingOrNew(
    businessSiteId: string,
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicsId?: number
  ): Observable<Response> {
    return this.apiService
      .get<Response>(
        this.createAndGetUrl + businessSiteId,
        this.buildParams(productCategoryId, serviceId, serviceCharacteristicsId)
      )
      .pipe(retryWhen(delayedRetryStrategy({ excludedStatusCodes: [400, 403, 500, 502, 503] })));
  }

  update(
    businessSiteId: string,
    service: Service,
    standardOpeningHours: StandardOpeningHour[],
    specialOpeningHours: SpecialOpeningHour[],
    taskData?: TaskData
  ): Observable<ObjectStatus> {
    return this.apiService.put(
      this.updateUrl + businessSiteId,
      {
        standardOpeningHours:
          OpeningHourConvertion.getStandardOpeningHourForRequest(standardOpeningHours),
        specialOpeningHours:
          OpeningHourConvertion.getSpecialOpeningHourForRequest(specialOpeningHours),
        taskData: {
          dueDate: taskData?.dueDate,
          comment: taskData?.comment
        }
      },
      this.buildParams(
        Number(service.productCategoryId),
        Number(service.serviceId),
        Number(service.serviceCharacteristicsId)
      )
    );
  }

  private buildParams(
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number
  ): HttpParams {
    let params = new HttpParams({ encoder: new CustomEncoder() });

    if (serviceId) {
      params = params.append('serviceId', serviceId.toString());
    }

    if (serviceCharacteristicId) {
      params = params.append('serviceCharacteristicId', serviceCharacteristicId.toString());
    }

    if (productCategoryId) {
      params = params.append('productCategoryId', productCategoryId.toString());
    }

    return params;
  }

  updateMultiEditOpeningHourData(
    Hours: Hours,
    multiSelectOfferedServices: MultiSelectOfferedServiceIds[],
    taskData?: TaskData
  ): Observable<updateOpeningHoursByOfferedServiceIdResponse> {
    return this.apiService.putCustom<updateOpeningHoursByOfferedServiceIdResponse>(this.url, {
      standardOpeningHours: OpeningHourConvertion.getMultiEditOpeningHoursForRequest(
        Hours.standardOpeningHours,
        multiSelectOfferedServices
      ),
      specialOpeningHours: OpeningHourConvertion.getMultiEditSpecialOpeningHoursForRequest(
        Hours.specialOpeningHours,
        multiSelectOfferedServices
      ),
      taskData: {
        dueDate: taskData?.dueDate,
        comment: taskData?.comment
      }
    });
  }
}
