import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';

import { ExternalKeyType } from './external-key-type.model';
import { Cache } from "../../../shared/util/cache";

const url = '/traits/api/v1/key-types';

interface ExternalKeyTypesResponse {
  keyTypes: ExternalKeyType[];
}

@Injectable()
export class ExternalKeyTypeService {
  private cache: Cache<ExternalKeyTypesResponse>;

  constructor(private apiService: ApiService) {
    this.cache = new Cache<ExternalKeyTypesResponse>(this.apiService, this.urlFor)
  }

  getAll(outletId?: string): Observable<ExternalKeyType[]> {
    const urlParam = outletId ? '?outletId=' + outletId : ""

    return this.cache
      .getOrLoad(urlParam)
      .asObservable()
      .pipe(
        map(result => (result ? result.keyTypes : [])
        ),
        catchError(err => {
          this.cache.clearFor(urlParam)
          return throwError(() => new Error(err));
        })
      )
  }

  private urlFor(outletParam: string): string {
    return url + outletParam
  }
}
