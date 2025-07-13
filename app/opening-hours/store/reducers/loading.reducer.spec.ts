import { Service, Hours, Outlet } from '.';
import { LoadingStatus } from '../../models/loading-status.model';
import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';

import * as fromLoading from './loading.reducers';

describe('Opening Hours Outlet Reducer Suite', () => {
  describe('undefined action', () => {
    test('should not change state', () => {
      const stateBefore: LoadingStatus = {
        isOpeningHoursLoading: true,
        isError: false,
        errorMsg: ''
      };
      const expectedState = stateBefore;
      const action: any = {};

      const state = fromLoading.reducer(stateBefore, action);

      expect(state).toEqual(expectedState);
    });
  });

  describe('openingHoursLoad action', () => {
    test('should update fields to new state on action', () => {
      const stateBefore: LoadingStatus = {
        isOpeningHoursLoading: false,
        isError: true,
        errorMsg: 'Unexpected Error'
      };

      const action = BrandProductGroupOpeningHoursActions.openingHoursLoad({
        outletId: 'GS1234561',
        productCategoryId: 1,
        serviceId: 1
      });

      const state = fromLoading.reducer(stateBefore, action);

      expect(state.isOpeningHoursLoading).toBeFalsy();
      expect(state.isError).toBeFalsy();
      expect(state.errorMsg).toEqual('');
      expect(state.errorStatus).toBeUndefined();
    });
  });

  describe('brandProductGroupOpeningHoursLoadSuccess action', () => {
    const anyService: Service = {
      serviceId: 1,
      productCategoryId: '2',
      serviceCharacteristicsId: '3',
      serviceName: 'sName',
      serviceCharacteristicName: 'cName',
      name: 'sName',
      translations: {}
    };
    const anyHours: Hours = {
      standardOpeningHours: [],
      specialOpeningHours: []
    };
    const anyPermissions: OpeningHoursPermissions = {
      brandRestrictions: [],
      productGroupRestrictions: []
    };
    const outlet: Outlet = {
      businessSiteId: 'GS1234561',
      countryId: 'DE'
    };

    test('should update loading to false on action', () => {
      const stateBefore = fromLoading.initialState;

      const action = BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess({
        service: anyService,
        hours: anyHours,
        outlet: outlet,
        permissions: anyPermissions
      });

      expect(stateBefore.isOpeningHoursLoading).toBeTruthy();

      const state = fromLoading.reducer(stateBefore, action);

      expect(state.isOpeningHoursLoading).toBeFalsy();
    });
  });

  describe('openingHoursApiFailure action', () => {
    test('should update fields to new state on opening hours load', () => {
      const stateBefore = fromLoading.initialState;

      const action = BrandProductGroupOpeningHoursActions.openingHoursApiFailure({
        error: {
          message: 'Unexpected Error',
          traceId: 'ABCDEFG',
          state: 500
        }
      });

      expect(stateBefore.isOpeningHoursLoading).toBeTruthy();

      const state = fromLoading.reducer(stateBefore, action);

      expect(state.isOpeningHoursLoading).toBeFalsy();
      expect(state.isError).toBeTruthy();
      expect(state.errorMsg).toEqual('Unexpected Error (ABCDEFG)');
      expect(state.errorStatus).toEqual(500);
    });
  });
});
