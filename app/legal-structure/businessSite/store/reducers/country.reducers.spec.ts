import { Country } from '../../../../geography/country/country.model';
import { getCountryMock } from '../../models/country.mock';
import { OutletCountryActions } from '../actions';

import * as fromCountry from './country.reducers';

describe('Country Reducer Suite', () => {
  const mockedCountry: Country = getCountryMock();

  describe('undefined action', () => {
    test('should return default state', () => {
      const expectedState = fromCountry.initialState;
      const action: any = {};
      const state = fromCountry.reducer(undefined, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadOutletCountrySuccess', () => {
    test('returns unchanged country as state', () => {
      const expectedState: Country = { ...mockedCountry };
      const beforeState = fromCountry.initialState;
      const action = OutletCountryActions.loadCountrySuccess({
        country: mockedCountry
      });
      const state = fromCountry.reducer(beforeState, action);
      expect(state).toEqual(expectedState);
    });

    test('returns country without properties for missing optional attributes as state', () => {
      const expectedState: Country = { ...mockedCountry };
      const beforeState: Country = { ...mockedCountry, defaultLanguageId: 'de_DE' };
      const action = OutletCountryActions.loadCountrySuccess({
        country: mockedCountry
      });
      const state = fromCountry.reducer(beforeState, action);
      expect(state).toEqual(expectedState);
    });
  });
});
