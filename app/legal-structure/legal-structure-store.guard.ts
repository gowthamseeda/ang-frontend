import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { BusinessSiteActionService } from './businessSite/services/business-site-action.service';
import { paramOutletId } from './legal-structure-routing-paths';

@Injectable()
export class LegalStructureStoreInitializer implements CanActivate {
  constructor(private actionService: BusinessSiteActionService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const outletId = next.paramMap.get(paramOutletId) || '';
    return this.dispatchActions(outletId);
  }

  dispatchActions(outletId: string): Observable<boolean> {
    this.actionService.dispatchResetOutlet();
    this.actionService.dispatchLoadOutlet(outletId);
    this.actionService.dispatchLoadBrandCodesFor(outletId);
    this.actionService.dispatchLoadBusinessNamesFor(outletId);
    this.actionService.dispatchLoadDistributionLevelsFor(outletId);
    return of(true);
  }
}
