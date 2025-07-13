import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { paramOutletId } from '../legal-structure/legal-structure-routing-paths';

import { OpeningHoursActionService } from './store/action-service';
import { OpeningHoursStoreService } from './store/store.service';

@Injectable()
export class OpeningHoursStoreInitializer implements CanActivate {
  constructor(
    private openingHoursActionService: OpeningHoursActionService,
    private openingHoursStoreService: OpeningHoursStoreService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const outletId = next.paramMap.get(paramOutletId);
    const productCategoryId = next.queryParamMap.get('productCategoryId');
    const serviceId = next.queryParamMap.get('serviceId');
    const serviceCharacteristicId = next.queryParamMap.get('serviceCharacteristicId');

    return this.initStore(
      outletId ? outletId : '',
      productCategoryId ? Number.parseFloat(productCategoryId) : 0,
      serviceId ? Number.parseFloat(serviceId) : 0,
      serviceCharacteristicId ? Number.parseFloat(serviceCharacteristicId) : undefined
    );
  }

  initStore(
    outletId: string,
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicsId?: number
  ): Observable<boolean> {
    return this.openingHoursStoreService
      .isInitialized(outletId, productCategoryId, serviceId, serviceCharacteristicsId)
      .pipe(
        tap(initialized => {
          if (!initialized) {
            this.openingHoursActionService.dispatchLoadOpeningHours(
              outletId,
              productCategoryId,
              serviceId,
              serviceCharacteristicsId
            );
          }
        }),
        map(initialized => true)
      );
  }
}
