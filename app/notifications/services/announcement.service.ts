import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { ObjectStatus } from '../../shared/services/api/objectstatus.model';
import { Announcement, AnnouncementType } from '../models/announcement.model';

const url = '/notifications/api/v1/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  constructor(private apiService: ApiService) {}

  get(type: AnnouncementType, languageId: string): Observable<Announcement> {
    return this.apiService.get<Announcement>(`${url}?type=${type}&languageId=${languageId}`);
  }

  update(resource: Announcement): Observable<ObjectStatus> {
    return this.apiService.put(url, resource);
  }
}
