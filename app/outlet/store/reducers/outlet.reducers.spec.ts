import * as fromOutlet from './outlet.reducers';
import { OutletActions } from '../actions';
import { getProfile } from '../../models/outlet-profile.mock';
import { OutletProfileState } from './outlet.reducers';

describe('Outlet Reducers Suite', () => {
  describe('loadOutletProfileSuccess action', () => {
    test('should change state', () => {
      const stateBefore = fromOutlet.initialOutletProfileState;
      const outletProfile = getProfile();
      const action = OutletActions.loadOutletProfileSuccess({
        profile: outletProfile,
        country: { translations: [] },
        languageId: ''
      });
      const state = fromOutlet.reducer(stateBefore, action);
      expect(state.businessSite).toEqual(outletProfile.businessSite);
      expect(state.businessNames).toEqual(outletProfile.businessNames);
      expect(state.businessSiteType).toEqual(outletProfile.businessSiteType);
      expect(state.brands).toEqual(outletProfile.brands);
      expect(state.brandCodes).toEqual(outletProfile.brandCodes);
      expect(state.productCategories).toEqual(outletProfile.productCategories);
      expect(state.productGroups).toEqual(outletProfile.productGroups);
      expect(state.services).toEqual(outletProfile.services);
      expect(state.openingHours).toEqual(outletProfile.openingHours);
    });
  });
  test('should not change state', () => {
    const stateBefore: OutletProfileState = {
      services: [],
      productGroups: [],
      productCategories: [],
      brandCodes: [],
      brands: [],
      businessSiteType: '',
      businessNames: [],
      businessSite: {
        registeredOffice: true,
        poBox: undefined,
        countryName: 'Germany',
        legalName: 'My legal name',
        id: 'GS1234567',
        address: {
          zipCode: '10585',
          streetNumber: '40',
          street: 'Haubachstrasse',
          district: '',
          city: '',
          addressAddition: ''
        },
        hasAssignedLabels: false
      },
      openingHours: {
        date: '',
        fromTime: '',
        toTime: ''
      }
    };
    const expectedState = stateBefore;
    const action: any = {};
    const state = fromOutlet.reducer(stateBefore, action);
    expect(state).toEqual(expectedState);
  });
});
