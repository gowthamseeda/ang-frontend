import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';

import { Hours, Outlet, Service } from './index';
import * as fromService from './service.reducers';

describe('Service Reducer Suite', () => {
  const anyHours: Hours = { standardOpeningHours: [], specialOpeningHours: [] };
  const anyOutlet: Outlet = {
    businessSiteId: 'GS1234561',
    countryId: 'any_GS'
  };
  const anyPermissions: OpeningHoursPermissions = {
    brandRestrictions: [],
    productGroupRestrictions: []
  };

  describe('undefined action', () => {
    test('should not change state.', () => {
      const stateBefore: Service = {
        serviceId: 0,
        productCategoryId: 'scId',
        serviceCharacteristicsId: 'scsId',
        serviceName: 'sName',
        serviceCharacteristicName: 'cName',
        name: 'sName'
      };
      const expectedState = stateBefore;
      const action: any = {};
      const state = fromService.reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('openingHoursLoadSuccess action', () => {
    test('should change all attributes in state', () => {
      const stateBefore = fromService.initialState;
      const service: Service = {
        serviceId: 0,
        productCategoryId: 'scId',
        serviceCharacteristicsId: 'scsId',
        serviceName: 'sName',
        serviceCharacteristicName: 'cName',
        name: 'sName'
      };
      const action = BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess({
        service: service,
        hours: anyHours,
        outlet: anyOutlet,
        permissions: anyPermissions
      });
      const state = fromService.reducer(stateBefore, action);
      expect(state.serviceId).toEqual(service.serviceId);
      expect(state.productCategoryId).toEqual(service.productCategoryId);
      expect(state.serviceCharacteristicsId).toEqual(service.serviceCharacteristicsId);
      expect(state.serviceName).toEqual(service.serviceName);
      expect(state.serviceCharacteristicName).toEqual(service.serviceCharacteristicName);
    });
  });
});
