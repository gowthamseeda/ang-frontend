import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { provideAutoSpy, Spy } from 'jest-auto-spies';
import { cold, hot } from 'jest-marbles';
import { clone } from 'ramda';
import { Observable, of } from 'rxjs';

import { UserService } from '../../../iam/user/user.service';
import { BrandService } from '../../../services/brand/brand.service';
import { ServiceService } from '../../../services/service/services/service.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { getSingleOpeningHourMock } from '../../models/brand-product-group-opening-hours.mock';
import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { OpeningHoursService } from '../../opening-hours.service';
import { BrandProductGroupOpeningHoursActions } from '../actions';

import { BrandProductGroupOpeningHoursEffects } from './brand-product-group-opening-hours.effects';
import { provideMockActions } from '@ngrx/effects/testing';

class ActivatedRouteStub {
  queryParams = of({
    productCategoryId: 1,
    serviceId: 120
  });
}

describe('BrandProductGroupOpeningHoursEffect', () => {
  const brandIds = ['MB', 'SMT', 'STR', 'FUSO', 'BAB', 'FTL', 'WST', 'STG', 'THB', 'MYB'];
  let effects: BrandProductGroupOpeningHoursEffects;
  let openingHoursServiceSpy: Spy<OpeningHoursService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let brandService: BrandService;
  let userService: UserService;
  let actions: Observable<any>;
  let serviceService: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrandProductGroupOpeningHoursEffects,
        provideMockActions(() => actions),
        provideAutoSpy(OpeningHoursService),
        provideAutoSpy(SnackBarService),
        {
          provide: UserService,
          useValue: {
            getProductGroupRestrictions: jest.fn(),
            getBrandRestrictions: jest.fn()
          }
        },
        {
          provide: BrandService,
          useValue: {
            getAllIds: jest.fn()
          }
        },
        {
          provide: ServiceService,
          useValue: {
            fetchBy: jest.fn(),
            selectBy: jest.fn()
          }
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ]
    });
    effects = TestBed.inject(BrandProductGroupOpeningHoursEffects);
    openingHoursServiceSpy = TestBed.inject<any>(OpeningHoursService);
    snackBarServiceSpy = TestBed.inject<any>(SnackBarService);
    userService = TestBed.inject(UserService);
    actions = TestBed.inject(Actions);

    brandService = TestBed.inject(BrandService);
    jest.spyOn(brandService, 'getAllIds').mockReturnValue(of(brandIds));
    serviceService = TestBed.inject(ServiceService);
  });

  test('should be created', waitForAsync(() => {
    expect(effects).toBeTruthy();
  }));

  describe('loadOpeningHours', () => {
    const action = BrandProductGroupOpeningHoursActions.openingHoursLoad({
      outletId: 'any_outletId',
      productCategoryId: 1,
      serviceId: 1
    });

    test('should return openingHoursLoadSuccess', () => {
      actions = hot('-a', { a: action });

      const apiResponse = getSingleOpeningHourMock();
      const responseOpeningHours = cold('-b|', {
        b: apiResponse
      });
      openingHoursServiceSpy.getExistingOrNew.mockReturnValue(responseOpeningHours);
      const expectedAction = BrandProductGroupOpeningHoursActions.openingHoursLoadSuccess({
        response: apiResponse
      });
      const expected = cold('--z', { z: expectedAction });

      expect(effects).toBeTruthy();
      expect(effects.loadOpeningHours).toBeObservable(expected);
    });

    test('should return openingHoursReload if task is present', () => {
      let taskAction = clone(action);
      taskAction = {
        ...taskAction,
        isTaskPresent: true
      };

      actions = hot('-a', { a: taskAction });

      const apiResponse = getSingleOpeningHourMock();
      const responseOpeningHours = cold('-b|', {
        b: apiResponse
      });
      openingHoursServiceSpy.getExistingOrNew.mockReturnValue(responseOpeningHours);
      const expectedAction = BrandProductGroupOpeningHoursActions.openingHoursReload({
        response: apiResponse
      });
      const expected = cold('--z', { z: expectedAction });

      expect(effects).toBeTruthy();
      expect(effects.loadOpeningHours).toBeObservable(expected);
    });

    test('should return openingHoursApiFailure in error case', () => {
      actions = hot('-a', { a: action });

      const error = new Error('some error');
      const responseOpeningHours = cold('-#|', null, error);
      openingHoursServiceSpy.getExistingOrNew.mockReturnValue(responseOpeningHours);

      const expectedAction = BrandProductGroupOpeningHoursActions.openingHoursApiFailure({
        error: error
      });
      const expected = cold('--z', { z: expectedAction });

      expect(effects).toBeTruthy();
      expect(effects.loadOpeningHours).toBeObservable(expected);
    });
  });

  describe('loadBrandProductGroupOpeningHours', () => {
    const apiResponse = getSingleOpeningHourMock();
    const service = {
      serviceId: apiResponse.serviceId,
      productCategoryId: apiResponse.productCategoryId,
      serviceCharacteristicsId: apiResponse.serviceCharacteristicId,
      serviceName: apiResponse.serviceName,
      serviceCharacteristicName: apiResponse.serviceCharacteristicName,
      name: apiResponse.serviceName,
      translations: apiResponse.translations
    };

    describe.each([
      [
        BrandProductGroupOpeningHoursActions.openingHoursLoadSuccess({
          response: { ...apiResponse }
        })
      ],
      [BrandProductGroupOpeningHoursActions.openingHoursReload({ response: { ...apiResponse } })]
    ])('loadBrandProductGroupOpeningHours', action => {
      test('should return brandProductGroupOpeningHoursLoadSuccess', () => {
        const permissions: OpeningHoursPermissions = {
          brandRestrictions: [],
          productGroupRestrictions: []
        };
        const loadBrandProductGroupOpeningHoursSuccessAction =
          BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess({
            service: service,
            hours: {
              standardOpeningHours: [],
              specialOpeningHours: []
            },
            outlet: {
              businessSiteId: apiResponse.businessSiteId,
              countryId: 'DE'
            },
            permissions: permissions
          });
        actions = hot('-a', { a: action });
        const responseProductGroupRestrictions = cold('-c|', {
          c: permissions.productGroupRestrictions
        });
        const responseBrandRestrictions = cold('-c|', { c: permissions.brandRestrictions });
        const responseServices = cold('-c|', { c: service });
        const expected = cold('---d', { d: loadBrandProductGroupOpeningHoursSuccessAction });

        jest.spyOn(userService, 'getProductGroupRestrictions').mockReturnValue(
          responseProductGroupRestrictions
        );
        jest.spyOn(userService, 'getBrandRestrictions').mockReturnValue(responseBrandRestrictions);
        jest.spyOn(serviceService, 'selectBy').mockReturnValue(responseServices);

        expect(effects).toBeTruthy();
        expect(snackBarServiceSpy).toBeTruthy();
        expect(effects.loadBrandProductGroupOpeningHours).toBeObservable(expected);
      });

      test('should return a openingHoursApiFailure if backEnd returns an error', () => {
        const error = new Error('some error');
        const openingHoursApiFailureAction =
          BrandProductGroupOpeningHoursActions.openingHoursApiFailure({ error: error });
        actions = hot('         -a', { a: action });
        const responseServices = cold('-b', { b: service });
        const responsePGRestrictions = cold('-c', { c: [] });
        const responseBrandRestrictions = cold('-#', null, error);
        const expected = cold(' ---(z|)', { z: openingHoursApiFailureAction });

        jest.spyOn(serviceService, 'selectBy').mockReturnValue(responseServices);
        jest.spyOn(userService, 'getProductGroupRestrictions').mockReturnValue(responsePGRestrictions);
        jest.spyOn(userService, 'getBrandRestrictions').mockReturnValue(responseBrandRestrictions);

        expect(snackBarServiceSpy).toBeTruthy();
        expect(effects.loadBrandProductGroupOpeningHours).toBeObservable(expected);
      });
    });
  });
});
