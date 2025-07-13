import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { Service } from '../models/service.model';
import { Cache } from "../../../shared/util/cache";

const url = '/services/api/v1/services';

interface ServiceResponse {
  services: Service[];
}

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {
  private cache: Cache<ServiceResponse>

  constructor(private apiService: ApiService) {
    this.cache = new Cache<ServiceResponse>(this.apiService, this.urlFor)
  }

  getAll(): Observable<Service[]> {
    return this.cache
      .getOrLoad("")
      .asObservable()
      .pipe(
        map(response => response.services),
        catchError( err => {
          this.cache.clearFor("")
          return throwError(() => new Error(err));
          })
      )
  }

  get(serviceId: number): Observable<Service> {
    return this.apiService.get<Service>(`${url}/${serviceId}`);
  }

  private urlFor(): string {
    return url
  }
}
