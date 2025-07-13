import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { getActivatedRouteSnapshotMock } from '../activated-route-snapshot.mock';
import { SnackBarService } from '../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../testing/testing.module';
import { OfferedServiceGuard } from './offered-service.guard';
import { OfferedServiceService } from './offered-service/offered-service.service';

describe('services guard suite', () => {
  const activatedRouteSnapshotMock = getActivatedRouteSnapshotMock();
  const offeredServices = [
    {
      id: 'GS1-1',
      productCategoryId: 1,
      serviceId: 1,
      brandId: 'MB',
      productGroupId: 'PC'
    }
  ];

  let guard: OfferedServiceGuard;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  beforeEach(() => {
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.isLoading.nextWith(false);
    offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
    routerSpy = createSpyFromClass(Router);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    TestBed.configureTestingModule({
      imports: [TestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        OfferedServiceGuard,
        {
          provide: OfferedServiceService,
          useValue: offeredServiceServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        }
      ]
    }).compileComponents();

    guard = TestBed.inject(OfferedServiceGuard);
  });

  test('', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    test('should allow routes if not loading and offered service is not empty', done => {
      guard.canActivate(activatedRouteSnapshotMock).subscribe(canActivate => {
        expect(canActivate).toBeTruthy();
        done();
      });
    });

    test('should not allow routes if not loading and offered service is empty', done => {
      offeredServiceServiceSpy.getAllForServiceWith.nextWith([]);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(canActivate => {
        expect(canActivate).toBeFalsy();
        done();
      });
    });

    test('should not navigate to service page if offered service is not empty', done => {
      guard.canActivate(activatedRouteSnapshotMock).subscribe(() => {
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    test('should navigate to service page if offered service is empty', done => {
      jest.spyOn(routerSpy, 'navigate');
      offeredServiceServiceSpy.getAllForServiceWith.nextWith([]);
      guard.canActivate(activatedRouteSnapshotMock).subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalled();
        done();
      });
    });
  });
});
