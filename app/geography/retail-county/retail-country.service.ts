import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';
import { Cache } from "../../shared/util/cache";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

const url = '/geography/api/v1/retail-countries-FE';

@Injectable({
  providedIn: 'root'
})
export class RetailCountryService {
  private cache: Cache<string[]>

  constructor(private apiService: ApiService) {
    this.cache = new Cache<string[]>(this.apiService, this.urlFor)
  }

  getAllIds() {
    return this.cache
      .getOrLoad("")
      .asObservable()
      .pipe(
        catchError(err => {
            this.cache.clearFor("")
            return throwError(() => new Error(err));
          }
        )
      )
  }

  private urlFor(): string {
    return url
  }
}
