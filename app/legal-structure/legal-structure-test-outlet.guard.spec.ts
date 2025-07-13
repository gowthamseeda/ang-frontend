import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { getActivatedRouteSnapshotMock } from '../activated-route-snapshot.mock';
import { UserService } from '../iam/user/user.service';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';
import { DistributionLevelsService } from '../traits/distribution-levels/distribution-levels.service';
import { LegalStructureTestOutletGuard } from './legal-structure-test-outlet.guard';

describe('LegalStructureTestOutletGuard', () => {
  const activatedRouteSnapshotMock = getActivatedRouteSnapshotMock();
  let guard: LegalStructureTestOutletGuard;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let userServiceSpy: Spy<UserService>;
  let routerSpy: Spy<Router>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = createSpyFromClass(UserService);

    userServiceSpy.getRoles.nextWith([]);

    distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);

    distributionLevelServiceSpy.get.nextWith([]);

    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    routerSpy = createSpyFromClass(Router);

    TestBed.configureTestingModule({
      providers: [
        LegalStructureTestOutletGuard,
        {
          provide: UserService,
          useValue: userServiceSpy
        },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        {
          provide: DistributionLevelsService,
          useValue: distributionLevelServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ],
      imports: [RouterTestingModule.withRoutes([])]
    });
    guard = TestBed.inject(LegalStructureTestOutletGuard);
  }));

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    test('should allow route if not test outlet and not test outlet user', done => {
      distributionLevelServiceSpy.get.nextWith(['']);
      userServiceSpy.getPermissions.nextWith(['legalstructure.businesssite.read']);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(canActivate => {
        expect(canActivate).toBeTruthy();
      });
      done();
    });

    test('should not allow route if test outlet and not test outlet user', done => {
      distributionLevelServiceSpy.get.nextWith(['TEST_OUTLET']);
      userServiceSpy.getPermissions.nextWith(['legalstructure.businesssite.read']);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(canActivate => {
        expect(canActivate).toBeFalsy();
      });
      done();
    });

    test('should allow route if test outlet and test outlet user', done => {
      distributionLevelServiceSpy.get.nextWith(['TEST_OUTLET']);
      userServiceSpy.getPermissions.nextWith(['legalstructure.testoutlet.read']);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(canActivate => {
        expect(canActivate).toBeTruthy();
      });
      done();
    });
  });
});
