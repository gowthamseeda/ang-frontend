import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MasterServiceVariant, MasterServiceVariantUpdate } from '../master-service-variant.model';
import { ApiService } from '../../../../../shared/services/api/api.service';

const url = '/services/api/v1/servicevariants/configurations';

export interface ServiceVariantResponse {
  serviceVariants: MasterServiceVariant[];
}

@Injectable()
export class MasterServiceVariantDataService extends DefaultDataService<MasterServiceVariant> {
  queryParam = '?autoCreate=true';

  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('MasterServiceVariant', http, httpUrlGenerator);
  }

  getAll(): Observable<MasterServiceVariant[]> {
    return this.apiService
      .get<ServiceVariantResponse>(url)
      .pipe(map(response => response.serviceVariants));
  }

  multiCreateOrUpdate(serviceVariants: MasterServiceVariantUpdate[]): Observable<any> {
    return this.apiService.put(`${url + this.queryParam}`, serviceVariants);
  }

  multiDelete(serviceVariants: MasterServiceVariant[]): Observable<any> {
    return this.apiService.delete(url, serviceVariants);
  }
}
