import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';

const url = '/iam/api/v1/users/search?role=';

@Injectable({
  providedIn: 'root'
})
export class UserSearchService {
  constructor(private apiService: ApiService) {}

  get(role: string, dataRestrictions: { [id: string]: string[] }): Observable<any> {
    return this.apiService.put(url + role, dataRestrictions);
  }
}
