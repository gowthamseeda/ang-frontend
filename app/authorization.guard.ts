import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserAuthorizationService } from './iam/user/user-authorization.service';
import { SnackBarService } from './shared/services/snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(
    private userAuthorizationService: UserAuthorizationService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const allowedPermissions: string[] | undefined = next.data['authorizationGuardPermissions'];
    const blockedPermissions: string[] | undefined =
      next.data['authorizationGuardBlockedPermissions'];

    const userHasAllowedPermissions = allowedPermissions
      ? this.userAuthorizationService.isAuthorizedFor.permissions(allowedPermissions).verify()
      : of(true);
    const userHasBlockedPermissions = blockedPermissions
      ? this.userAuthorizationService.isAuthorizedFor.permissions(blockedPermissions).verify()
      : of(false);

    return zip(userHasAllowedPermissions, userHasBlockedPermissions).pipe(
      map(([hasAllowedPermissions, hasBlockedPermissions]) => {
        const isPermitted = hasAllowedPermissions && !hasBlockedPermissions;
        if (!isPermitted) {
          this.snackBarService.showInfo('PERMISSION_DENIED');
        }
        return isPermitted ? isPermitted : this.router.parseUrl('/dashboard');
      })
    );
  }
}
