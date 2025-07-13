import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../iam/user/user.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';
import { DistributionLevelsService } from '../traits/distribution-levels/distribution-levels.service';
import { paramOutletId } from './legal-structure-routing-paths';

@Injectable()
export class LegalStructureTestOutletGuard implements CanActivate {
  constructor(
    private snackBarService: SnackBarService,
    private distributionLevelService: DistributionLevelsService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const outletId = route.paramMap.get(paramOutletId) || '';

    const distributionLevels = this.distributionLevelService.get(outletId).pipe(
      map(levels => levels.includes('TEST_OUTLET')),
      take(1)
    );

    const userPermissions = this.userService.getPermissions().pipe(
      map(permissions => permissions.includes('legalstructure.testoutlet.read')),
      take(1)
    );

    return forkJoin([userPermissions, distributionLevels]).pipe(
      map(([isTestOutletUser, isTestOutlet]) => {
        let isPermitted: boolean;
        if (isTestOutlet && !isTestOutletUser) {
          this.snackBarService.showInfo('PERMISSION_DENIED');
          isPermitted = false;
        } else {
          isPermitted = true;
        }
        return isPermitted ? isPermitted : this.router.parseUrl('/dashboard');
      })
    );
  }
}
