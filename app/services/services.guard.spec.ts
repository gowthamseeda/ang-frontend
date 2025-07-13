import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { cold } from 'jest-marbles';

import { getActivatedRouteSnapshotMock } from '../activated-route-snapshot.mock';
import { UserAuthorizationService } from '../iam/user/user-authorization.service';
import { getOutletMock } from '../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../legal-structure/shared/services/outlet.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../testing/testing.module';

import { ServicesGuard } from './services.guard';

describe('services guard suite', () => {
  const activatedRouteSnapshotMock = getActivatedRouteSnapshotMock();
  let guard: ServicesGuard;
  let outletServiceSpy: Spy<OutletService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let routerSpy: Spy<Router>;
  let routerStateSnapshotSpy: Spy<RouterStateSnapshot>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  beforeEach(() => {
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletMock());
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    routerSpy = createSpyFromClass(Router);
    routerStateSnapshotSpy = createSpyFromClass(RouterStateSnapshot);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    TestBed.configureTestingModule({
      imports: [TestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ServicesGuard,
        {
          provide: OutletService,
          useValue: outletServiceSpy
        },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: {
              country: () => userAuthorizationServiceSpy
            }
          }
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: RouterStateSnapshot,
          useValue: routerStateSnapshotSpy
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        }
      ]
    }).compileComponents();

    guard = TestBed.inject(ServicesGuard);
  });

  test('', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    test('should allow routes if user is authorized for the country', () => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      const expected = cold('a', { a: true });
      expect(guard.canActivate(activatedRouteSnapshotMock)).toBeObservable(expected);
    });

    test('should block routes if user is not authorized', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(isAuthorized => {
        expect(isAuthorized).toBeFalsy();
        done();
      });
    });

    test('should show snack bar if user is not authorized', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(() => {
        done();
      });
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('PERMISSION_DENIED');
    });

    test('should block routes if outlet can not be found', done => {
      outletServiceSpy.getOrLoadBusinessSite.throwWith(new Error('error'));

      guard.canActivate(activatedRouteSnapshotMock).subscribe(isAuthorized => {
        expect(isAuthorized).toBeFalsy();
        done();
      });
    });
  });
});
