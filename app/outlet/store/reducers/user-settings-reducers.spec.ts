import { initialUserSettingsState, UserSettingsState } from './user-settings.reducers';
import * as fromUserSettingsStatus from './user-settings.reducers';
import { OutletActions } from '../actions';
import { getProfile } from '../../models/outlet-profile.mock';
import { CountryState } from './country.reducers';

describe('user-settings reducer suite', () => {
  test('should not change state for unknown action', () => {
    const stateBefore: UserSettingsState = { languageId: 'any_id' };
    const action: any = {};
    const state = fromUserSettingsStatus.reducer(stateBefore, action);
    expect(state).toStrictEqual(stateBefore);
  });

  test('should change state for loadOutletProfileSuccess action', () => {
    const action = OutletActions.loadOutletProfileSuccess({
      profile: getProfile(),
      country: getCountry(),
      languageId: '1234'
    });
    const stateExpected: UserSettingsState = { languageId: '1234' };
    const state = fromUserSettingsStatus.reducer(initialUserSettingsState, action);
    expect(state).toStrictEqual(stateExpected);
  });
});

function getCountry(): CountryState {
  return {
    translations: [
      {
        'en-US': 'Vehicle',
        'de-DE': 'Fahrzeug'
      }
    ]
  };
}
