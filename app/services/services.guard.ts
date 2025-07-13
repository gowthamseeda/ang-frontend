import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../iam/user/user-authorization.service';
import { paramOutletId } from '../legal-structure/legal-structure-routing-paths';
import { OutletService } from '../legal-structure/shared/services/outlet.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesGuard implements CanActivate {
  constructor(
    private outletService: OutletService,
    private userAuthorizationService: UserAuthorizationService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const outletId = route.paramMap.get(paramOutletId) || '';
    return this.outletService.getOrLoadBusinessSite(outletId).pipe(
      switchMap(outlet =>
        this.userAuthorizationService.isAuthorizedFor
          .country(outlet.countryId)
          .verify()
          .pipe(
            tap(
              isAuthorizedForCountry =>
                !isAuthorizedForCountry && this.snackBarService.showInfo('PERMISSION_DENIED')
            ),
            map(isAuthorizedForCountry =>
              isAuthorizedForCountry ? isAuthorizedForCountry : this.router.parseUrl('/dashboard')
            )
          )
      ),
      catchError(() => {
        return of(false);
      })
    );
  }
}
