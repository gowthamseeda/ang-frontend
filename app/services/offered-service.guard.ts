import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { paramOutletId, servicesPath } from '../legal-structure/legal-structure-routing-paths';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';

import { OfferedServiceService } from './offered-service/offered-service.service';

@Injectable({
  providedIn: 'root'
})
export class OfferedServiceGuard implements CanActivate {
  private unsubscribe = new Subject<void>();
  private canActivateRoute: ReplaySubject<boolean>;

  constructor(
    private snackBarService: SnackBarService,
    private offeredServiceService: OfferedServiceService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.canActivateRoute = new ReplaySubject(1);
    const outletId = route.paramMap.get(paramOutletId) || '';
    const serviceId = Number(route.queryParamMap.get('serviceId'));
    this.offeredServiceService.fetchAllForOutlet(outletId);

    this.checkOfferedServicesIsLoading(outletId, serviceId);

    return this.canActivateRoute.pipe(first());
  }

  private checkOfferedServicesIsLoading(outletId: string, serviceId: number): void {
    this.offeredServiceService
      .isLoading()
      .pipe(
        takeUntil(this.unsubscribe),
        tap(isLoading => {
          if (!isLoading) {
            this.offeredServiceService
              .getAllForServiceWith(serviceId)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(offeredServices => {
                if (offeredServices.length !== 0) {
                  this.canActivateRoute.next(true);
                } else {
                  this.canActivateRoute.next(false);
                  this.navigateToServicePage(outletId);
                }
                this.unsubscribe.next();
              });
          }
        })
      )
      .subscribe();
  }

  private navigateToServicePage(outletId: string): void {
    this.router.navigate([`/outlet/${servicesPath}`.replace(':outletId', outletId)]);
    this.snackBarService.showInfo('SERVICE_NOT_OFFERED');
  }
}
