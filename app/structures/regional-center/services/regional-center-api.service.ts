import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import {
  RegionalCenterResource,
  RegionalCentersResource
} from '../model/regional-center-api.model';

const baseURL = '/structures/api/v1/regional-centers';

@Injectable()
export class RegionalCenterApiService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<RegionalCentersResource> {
    return this.apiService.get<RegionalCentersResource>(`${baseURL}`);
  }

  get(regionalCenterId: string): Observable<RegionalCenterResource> {
    return this.apiService.get<RegionalCenterResource>(`${baseURL}/${regionalCenterId}`);
  }

  post(regionalCenter: RegionalCenterResource): Observable<ObjectStatus> {
    return this.apiService.post(`${baseURL}`, regionalCenter);
  }

  put(regionalCenter: RegionalCenterResource): Observable<ObjectStatus> {
    return this.apiService.put(`${baseURL}/${regionalCenter.regionalCenterId}`, regionalCenter);
  }

  delete(regionalCenterId: string): Observable<ObjectStatus> {
    return this.apiService.delete(`${baseURL}/${regionalCenterId}`);
  }
}
