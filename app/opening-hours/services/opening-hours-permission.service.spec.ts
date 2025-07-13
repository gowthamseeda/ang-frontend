import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { DistributionLevelsService } from '../../traits/distribution-levels/distribution-levels.service';
import { getInitialState } from '../store/opening-hours-state.mock';
import { OpeningHoursState } from '../store/reducers';
import { initialState as initialPermissionsState } from '../store/reducers/permission.reducers';
import {
  BrandProductGroupInfo,
  GroupedSpecialOpeningHour,
  selectIsCreateAndSaveAllowed,
  selectOpeningHoursPermissions
} from '../store/selectors';

import { OpeningHoursPermissionService } from './opening-hours-permission.service';

describe('OpeningHoursPermissionService Suite ', () => {
  let permissionService: OpeningHoursPermissionService;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsService: DistributionLevelsService;
  let store: MockStore<OpeningHoursState>;
  const initialState = getInitialState();

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.observableDistributionLevels.mockReturnValue(
      userAuthorizationServiceSpy
    );
    userAuthorizationServiceSpy.verify.nextWith(true);
    // need to reset testing module before configure again (destroyAfterEach is enabled)
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        OpeningHoursPermissionService,
        DistributionLevelsService,
        ApiService,
        LoggingService,
        provideMockStore({ initialState }),
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        {
          provide: DistributionLevelsService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    });
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectOpeningHoursPermissions, initialPermissionsState);
    store.overrideSelector(selectIsCreateAndSaveAllowed, true);
    distributionLevelsService = TestBed.inject(DistributionLevelsService);
    jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of(['RETAILER']));
    userAuthorizationServiceSpy.verify.nextWith(true);
    permissionService = TestBed.inject(OpeningHoursPermissionService);
  });

  test('initializes successful', () => {
    expect(permissionService).toBeTruthy();
    expect(distributionLevelsService).toBeTruthy();
  });

  describe('isDeleteSpecialOpeningHourAllowed', () => {
    const productGroupInfo_Mb_PcTruck_Hours: BrandProductGroupInfo = {
      brandId: 'MB',
      productGroupIds: ['PC', 'TRUCK'],
      hasHours: true
    };
    const productGroupInfo_Smt_PcVan_noHours: BrandProductGroupInfo = {
      brandId: 'SMT',
      productGroupIds: ['PC', 'VAN'],
      hasHours: false
    };
    const productGroupInfo_MB_Van_Hours: BrandProductGroupInfo = {
      brandId: 'MB',
      productGroupIds: ['VAN'],
      hasHours: true
    };

    const groupedSpecialHour: GroupedSpecialOpeningHour = {
      startDate: '2020-01-01',
      endDate: '2020-01-05',
      brandProductGroupInfo: [],
      configured: true
    };

    test('returns false if page update is not permitted', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        [],
        [],
        false
      );
      expect(allowed).toBe(false);
    });

    test('returns true if page update is permitted, there are no values for special hours, no other restrictions exists', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [productGroupInfo_Smt_PcVan_noHours]
      };
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        [],
        [],
        true
      );
      expect(allowed).toBe(true);
    });

    test('returns true if page update is permitted, there are values for special hours, no other restrictions exists', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        [],
        [],
        true
      );
      expect(allowed).toBe(true);
    });

    test('returns false if page update is permitted, there are values for special hours but brand restrictions do not match to them', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const restrictedBrands = ['SMT', 'MYB'];
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        restrictedBrands,
        [],
        true
      );
      expect(allowed).toBe(false);
    });

    test('returns false if page update is permitted, there are values for special hours but productGroup restrictions do not match to them', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const restrictedProductGroups = ['PC', 'VAN', 'UNIMOG'];
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        [],
        restrictedProductGroups,
        true
      );
      expect(allowed).toBe(false);
    });

    test('returns true if page update is permitted, there are values for special hours and brand-, productGroup restrictions match to them', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const restrictedBrands = ['MB', 'MYB'];
      const restrictedProductGroups = ['PC', 'VAN', 'TRUCK'];
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        restrictedBrands,
        restrictedProductGroups,
        true
      );
      expect(allowed).toBe(true);
    });

    test('returns true if page update is permitted, there are values for special hours, no productGroup restrictions, but brand restrictions do not match to them', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const restrictedBrands = ['MB', 'MYB'];
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        restrictedBrands,
        [],
        true
      );
      expect(allowed).toBe(true);
    });

    test('returns true if page update is permitted, there are values for special hours, no brand restrictions, but productGroup restrictions do not match to them', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [
          productGroupInfo_Mb_PcTruck_Hours,
          productGroupInfo_Smt_PcVan_noHours
        ]
      };
      const restrictedProductGroups = ['PC', 'VAN', 'TRUCK'];
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        [],
        restrictedProductGroups,
        true
      );
      expect(allowed).toBe(true);
    });

    test('screen', () => {
      const groupedHours: GroupedSpecialOpeningHour = {
        ...groupedSpecialHour,
        brandProductGroupInfo: [productGroupInfo_Mb_PcTruck_Hours, productGroupInfo_MB_Van_Hours]
      };
      const restrictedBrands = ['MB'];
      const restrictedProductGroups = ['PC', 'TRUCK', 'UNIMOG'];
      const allowed = permissionService.isDeleteSpecialOpeningHourAllowed(
        groupedHours,
        restrictedBrands,
        restrictedProductGroups,
        true
      );
      expect(allowed).toBe(true);
    });
  });
});
