import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from '../../services/api/api.service';
import { LoggingService } from '../../services/logging/logging.service';
import { Cache } from "../../util/cache";

const url = '/feature-toggle/api/v1/featuretoggles/'

export class FeatureToggle {
  enabled: boolean;
  constructor() {}
}

@Injectable()
export class FeatureToggleService {
  private cache: Cache<FeatureToggle>
  constructor(private apiService: ApiService, private logger: LoggingService) {
    this.cache = new Cache<FeatureToggle>(this.apiService, this.urlFor)
  }

  isFeatureEnabled(featureName: string): Observable<boolean> {
    if(featureName === 'FOCUS') return of(true);

    return this.cache
      .getOrLoad(featureName)
      .asObservable()
      .pipe(
        map( response => {
          return response.enabled
        }),
      catchError(err => {
        this.logger.error(err);
        this.cache.clearFor(featureName)
        return of(false);
      })
    );
  }

  isFocusFeatureEnabled(): Observable<boolean> {
    return this.isFeatureEnabled('FOCUS');
  }

  private urlFor(featureName: string): string {
    return url + featureName
  }
}
