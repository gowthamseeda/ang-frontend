import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';

import * as fromPermissions from './permission.reducers';

describe('Opening Hours Permissions Reducer Suite', () => {
  test('should get initial state', () => {
    const stateBefore = fromPermissions.initialState;
    const expectedState = stateBefore;
    const action: any = {};
    const state = fromPermissions.reducer(stateBefore, action);
    expect(state).toEqual(expectedState);
  });

  test('should change permissions', () => {
    const stateBefore = fromPermissions.initialState;
    const brands = ['MB', 'SMT'];
    const productGroups = ['PC', 'VAN', 'UNIMOG'];
    const permissions: OpeningHoursPermissions = {
      brandRestrictions: brands,
      productGroupRestrictions: productGroups
    };

    const action = BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess({
      service: {
        serviceId: 1,
        productCategoryId: '2',
        serviceCharacteristicsId: '3',
        serviceName: 'sName',
        serviceCharacteristicName: 'cName',
        name: 'sName'
      },
      hours: {
        standardOpeningHours: [],
        specialOpeningHours: []
      },
      outlet: {
        businessSiteId: 'GS1234561',
        countryId: 'DE'
      },
      permissions: permissions
    });

    const state = fromPermissions.reducer(stateBefore, action);
    expect(state).toEqual(permissions);
  });
});
