import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../shared/services/api/api.service';

import { UpdateUserDataRestrictions, UserDataRestrictions } from './user-data-restrictions.model';

const url = '/iam/api/v1/user';

@Injectable({
  providedIn: 'root'
})
export class UserDataRestrictionsService {
  constructor(private apiService: ApiService) {}

  get(userId: string): Observable<UserDataRestrictions> {
    return this.apiService.get<UserDataRestrictions>(
      url + '/' + userId + '/datarestrictions/settings'
    );
  }

  update(userId: string, userDataRestrictions: UpdateUserDataRestrictions): Observable<any> {
    return this.apiService.patch(
      url + '/' + userId + '/datarestrictions/settings',
      userDataRestrictions
    );
  }
}
