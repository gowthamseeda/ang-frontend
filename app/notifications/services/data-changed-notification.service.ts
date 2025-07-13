import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';

import { CommunicationNotification, DataNotification, OpeningHourNotification } from '../models/notifications.model';

const url = '/notifications/api/v1/notifications/';

@Injectable({
  providedIn: 'root'
})
export class DataChangedNotificationService {
  constructor(private apiService: ApiService) {}

  get(businessSiteId: string, companyId: string): Observable<DataNotification[]> {
    return this.apiService.get<DataNotification[]>(url + companyId  + "/" + businessSiteId);
  }

  read(businessSiteId: string, companyId: string, fields: string[], taskStatus: string): Observable<string> {
    const fullUrl = `${url}${companyId}/${businessSiteId}/read/${taskStatus}`;
    return this.apiService.putCustom<string>(fullUrl, fields);
  }

  getOpeningHoursNotification(businessSiteId: string, serviceId: number): Observable<OpeningHourNotification[]> {
    const fullUrl = `${url}businessSiteId/${businessSiteId}/serviceId/${serviceId}/opening-hours`
    return this.apiService.get<OpeningHourNotification[]>(fullUrl);
  }

  getCommunicationsNotification(businessSiteId: string, serviceId: number): Observable<CommunicationNotification[]> {
    const fullUrl = `${url}businessSiteId/${businessSiteId}/serviceId/${serviceId}/communication-data`
    return this.apiService.get<CommunicationNotification[]>(fullUrl);
  }
}
