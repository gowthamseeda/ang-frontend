import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DistributionLevelsService } from '../../traits/distribution-levels/distribution-levels.service';
import { FeatureToggleService } from '../directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../model/constants';

export interface DistributionLevelGuardData {
  allowedDistributionLevels: string[];
  outletIdParam: string;
}

@Injectable()
export class DistributionLevelGuard implements CanActivate {
  constructor(
    private distributionLevelsService: DistributionLevelsService,
    private featureToggleService: FeatureToggleService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const data: DistributionLevelGuardData = next.data.distributionLevelGuard;
    if (data && data.outletIdParam && data.allowedDistributionLevels) {
      const distributionLevels = data.allowedDistributionLevels ?? [];
      const outletId = next.paramMap.get(data.outletIdParam) ?? '';
      return this.canAccess(outletId, distributionLevels);
    }
    return of(false);
  }

  canAccess(outletId: string, allowedDistributionLevels: string[]): Observable<boolean> {
    return combineLatest([
      this.distributionLevelsService.get(outletId),
      this.featureToggleService.isFeatureEnabled(
        FEATURE_NAMES.SERVICES_DISTRIBUTION_LEVEL_RESTRICTION
      )
    ]).pipe(
      map(([levels, isEnabledDistributionLevels]) => {
        if (isEnabledDistributionLevels) {
          return isEnabledDistributionLevels;
        } else {
          return levels.some(level => allowedDistributionLevels.includes(level));
        }
      }),
      catchError(() => of(false))
    );
  }
}
