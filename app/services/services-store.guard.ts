import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { LegalStructureRoutingService } from '../legal-structure/legal-structure-routing.service';

import { OfferedServiceService } from './offered-service/offered-service.service';
import { ServiceVariantService } from './service-variant/service-variant.service';
import { ServiceService } from './service/services/service.service';

@Injectable()
export class ServicesStoreInitializer implements CanActivate {
  private currentOutletId: string;
  private isLoading: ReplaySubject<boolean> = new ReplaySubject(1);
  private unsubscribe = new Subject<void>();

  constructor(
    private legalStructureRoutingService: LegalStructureRoutingService,
    private serviceService: ServiceService,
    private offeredService: OfferedServiceService,
    private serviceVariantService: ServiceVariantService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.onOutletIdChanges();
    return this.currentOutletId ? this.isLoading.pipe(first()) : of(true);
  }

  private onOutletIdChanges(): void {
    this.legalStructureRoutingService.outletIdChanges
      .pipe(
        tap(outletId => {
          if (outletId && outletId !== this.currentOutletId) {
            this.currentOutletId = outletId;
            this.serviceService.fetchAll();
            this.offeredService.fetchAllForOutlet(this.currentOutletId);
            this.serviceVariantService.fetchAllBy(this.currentOutletId);
            this.checkServicesIsLoading();
          }
        })
      )
      .subscribe();
  }

  private checkServicesIsLoading(): void {
    combineLatest([
      this.serviceService.isLoading(),
      this.offeredService.isLoading(),
      this.serviceVariantService.isLoading()
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        tap(([isServiceLoading, isOfferedServiceLoading, isServiceVariantLoading]) => {
          if (!(isServiceLoading || isOfferedServiceLoading || isServiceVariantLoading)) {
            this.isLoading.next(true);
            this.unsubscribe.next();
          }
        })
      )
      .subscribe();
  }
}
