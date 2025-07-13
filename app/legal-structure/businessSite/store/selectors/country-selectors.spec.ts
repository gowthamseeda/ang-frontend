import { getCountryMock } from '../../models/country.mock';
import { initialState as initialStateBusinessSite } from '../reducers';
import { BusinessSiteState } from '../state.model';

import { Country } from '../../../../geography/country/country.model';
import { selectCountryState } from './country-selectors';

describe('Country Selectors Test Suite', () => {
  describe('selectCountryState', () => {
    test('should return country', () => {
      const country: Country = getCountryMock();
      const state: BusinessSiteState = { ...initialStateBusinessSite, country: country };
      const selection = selectCountryState.projector(state);
      expect(selection).toEqual(country);
    });
  });
});
