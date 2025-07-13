import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserAuthorizationService } from '../iam/user/user-authorization.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationGuard implements CanActivate {
  constructor(
    private userAuthorizationService: UserAuthorizationService,
    private snackBarService: SnackBarService
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['communications.communicationdata.read'])
      .verify()
      .pipe(tap(allowed => !allowed && this.snackBarService.showInfo('PERMISSION_DENIED')));
  }
}
