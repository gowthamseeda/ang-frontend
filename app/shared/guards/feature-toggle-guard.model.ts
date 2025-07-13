import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { FeatureToggleService } from './../directives/feature-toggle/feature-toggle.service';

export interface FeatureToggleGuardData {
  featureName: string;
}

@Injectable()
export class FeatureToggleGuard implements CanActivate {
  constructor(private featureToggleService: FeatureToggleService) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const data: FeatureToggleGuardData = next.data.featureToggleGuard;
    return data && data.featureName ? this.canAccess(data.featureName) : of(true);
  }

  canAccess(featureName: string): Observable<boolean> {
    return this.featureToggleService
      .isFeatureEnabled(featureName)
      .pipe(catchError(() => of(false)));
  }
}
