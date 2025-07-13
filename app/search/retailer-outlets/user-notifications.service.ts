import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import {UserNotifications} from "../models/user-notifcations.model";

const url = '/notifications/api/v1/usernotifications';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationsService {
  constructor(private apiService: ApiService) {}
  get(): Observable<UserNotifications[]> {
    return this.apiService.get<UserNotifications[]>(url);
  }

  updateNotification(businessSiteId: string): Observable<any> {
    return this.apiService.put(url + '/' + businessSiteId, null);
  }

}
