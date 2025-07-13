import { TestBed, waitForAsync } from '@angular/core/testing';
import { PRIMARY_OUTLET, RouterStateSnapshot, UrlSegmentGroup, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { getActivatedRouteSnapshotMock } from './activated-route-snapshot.mock';
import { AuthorizationGuard } from './authorization.guard';
import { UserAuthorizationService } from './iam/user/user-authorization.service';
import { SnackBarService } from './shared/services/snack-bar/snack-bar.service';

describe('AuthorizationGuard', () => {
  const activatedRouteSnapshotMock = getActivatedRouteSnapshotMock();
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let routerStateSnapshotSpy: Spy<RouterStateSnapshot>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let guard: AuthorizationGuard;

  beforeEach(
    waitForAsync(() => {
      routerStateSnapshotSpy = createSpyFromClass(RouterStateSnapshot);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService, [
        'permissions',
        'verify'
      ]);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);

      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        providers: [
          AuthorizationGuard,
          {
            provide: UserAuthorizationService,
            useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
          },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        imports: [RouterTestingModule.withRoutes([])]
      });
      guard = TestBed.inject(AuthorizationGuard);
    })
  );

  test('should have been called with specific app routing permissions', () => {
    guard.canActivate(activatedRouteSnapshotMock, routerStateSnapshotSpy);

    expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith([
      'legalstructure.businesssite.create',
      'legalstructure.businesssite.update',
      'legalstructure.company.create',
      'legalstructure.company.update',
      'geography.country.update',
      'geography.country.delete'
    ]);
    expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith(['app.retail.hide']);
  });

  test('should activate route', done => {
    userAuthorizationServiceSpy.permissions.calledWith(
      activatedRouteSnapshotMock.data['authorizationGuardPermissions']
    );
    userAuthorizationServiceSpy.permissions.calledWith(
      activatedRouteSnapshotMock.data['authorizationGuardBlockedPermissions']
    );
    userAuthorizationServiceSpy.verify.nextWith(true);
    const canActivate = guard.canActivate(activatedRouteSnapshotMock, routerStateSnapshotSpy);

    canActivate.subscribe(isActivated => {
      expect(isActivated).toBeTruthy();
      done();
    });
  });

  test('should not activate route and trigger navigation to dashboard', done => {
    userAuthorizationServiceSpy.permissions.calledWith(
      activatedRouteSnapshotMock.data['authorizationGuardPermissions']
    );
    userAuthorizationServiceSpy.permissions.calledWith(
      activatedRouteSnapshotMock.data['authorizationGuardBlockedPermissions']
    );
    userAuthorizationServiceSpy.verify.nextWith(true);
    const canActivate = guard.canActivate(activatedRouteSnapshotMock, routerStateSnapshotSpy);

    canActivate.subscribe((urlTree: boolean | UrlTree) => {
      const rootSegmentGroup: UrlSegmentGroup = urlTree['root'];
      expect(rootSegmentGroup).toBeDefined();
      const primaryRouterOutletSegmentGroup: UrlSegmentGroup =
        rootSegmentGroup.children[PRIMARY_OUTLET];
      expect(primaryRouterOutletSegmentGroup.segments).toContainEqual({
        path: 'dashboard',
        parameters: {}
      });
      done();
    });
  });
});
