import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../../shared/services/api/api.service';
import { ObjectPosition } from '../../../shared/position-control/position-control.model';
import { MasterService } from '../master-service.model';

const url = '/services/api/v1/services';

export interface ServiceResponse {
  services: MasterService[];
}

@Injectable()
export class MasterServiceDataService extends DefaultDataService<MasterService> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('MasterService', http, httpUrlGenerator);
  }

  getAll(): Observable<MasterService[]> {
    return this.apiService.get<ServiceResponse>(url).pipe(map(response => response.services));
  }

  getById(serviceId: number): Observable<MasterService> {
    return this.apiService
      .get(`${url}/${serviceId}`)
      .pipe(map(service => Object.assign({ id: serviceId } as MasterService, service)));
  }

  add(service: MasterService): Observable<any> {
    return this.apiService.post(url, service);
  }

  update(service: Update<MasterService>): Observable<any> {
    return this.apiService.put(`${url}/${service.id}`, { ...service.changes });
  }

  updatePosition(service: ObjectPosition): Observable<any> {
    return this.apiService.put(`${url}/${service.id}/position`, service);
  }

  delete(serviceId: number): Observable<any> {
    return this.apiService.delete(url + '/' + serviceId);
  }
}
