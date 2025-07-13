import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { ObjectStatus } from '../../shared/services/api/objectstatus.model';

import { EmailSetting } from '../models/notifications.model';

const url = '/notifications/api/v1/email-settings/countries';

@Injectable({
  providedIn: 'root'
})
export class EmailSettingService {
  constructor(private apiService: ApiService) {}

  get(countryId: string): Observable<EmailSetting> {
    return this.apiService.get<EmailSetting>(url + '/' + countryId);
  }

  update(emailSetting: EmailSetting): Observable<ObjectStatus> {
    return this.apiService.put(url + '/' + emailSetting.countryId, emailSetting);
  }

  delete(countryId: string): Observable<ObjectStatus> {
    return this.apiService.delete(url + '/' + countryId);
  }
}
