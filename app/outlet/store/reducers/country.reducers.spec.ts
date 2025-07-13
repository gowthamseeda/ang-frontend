import { CountryState, initialCountryState } from './country.reducers';
import * as fromCountry from './country.reducers';
import { OutletActions } from '../actions';
import { getProfile } from '../../models/outlet-profile.mock';

describe('country reducer suite', () => {
  test('should return initial state', () => {
    const stateBefore: CountryState = initialCountryState;
    const action: any = {};
    const state = fromCountry.reducer(stateBefore, action);
    expect(state).toStrictEqual(stateBefore);
  });
  test('should return country', () => {
    const stateBefore: CountryState = initialCountryState;
    const outletProfile = getProfile();
    const country: CountryState = {
      translations: [
        {
          'en-US': 'Vehicle',
          'de-DE': 'Fahrzeug'
        }
      ]
    };
    const languageId = 'de-DE';
    const action = OutletActions.loadOutletProfileSuccess({
      profile: outletProfile,
      country: country,
      languageId: languageId
    });
    const state = fromCountry.reducer(stateBefore, action);
    expect(state).toStrictEqual(country);
  });
});
