import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';

import { Hours, Outlet, Service } from './index';
import * as fromOutlet from './outlet.reducers';

describe('Opening Hours Outlet Reducer Suite', () => {
  describe('undefined action', () => {
    test('should not change state', () => {
      const stateBefore: Outlet = {
        businessSiteId: 'GS1234561',
        countryId: 'DE'
      };
      const expectedState = stateBefore;
      const action: any = {};

      const state = fromOutlet.reducer(stateBefore, action);

      expect(state).toEqual(expectedState);
    });
  });

  describe('openingHoursLoadSuccess action', () => {
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

    test('should change all attributes in state', () => {
      const stateBefore = fromOutlet.initialState;
      const outlet: Outlet = {
        businessSiteId: 'GS1234561',
        countryId: 'DE'
      };
      const action = BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess({
        service: anyService,
        hours: anyHours,
        outlet: outlet,
        permissions: anyPermissions
      });

      const state = fromOutlet.reducer(stateBefore, action);

      expect(state.countryId).toEqual('DE');
      expect(state.businessSiteId).toEqual('GS1234561');
    });
  });
});
