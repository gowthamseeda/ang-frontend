import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../shared/services/api/api.service';

import { Histories } from './history.model';

const url = '/iam/api/v1/histories';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(private apiService: ApiService) {}

  getUserDataRestrictionsHistoryUrl(userId: string): string {
    return url + '/datarestrictions/settings?userId=' + userId;
  }

  get(userId: string): Observable<Histories> {
    return this.apiService.get<Histories>(this.getUserDataRestrictionsHistoryUrl(userId));
  }
}
