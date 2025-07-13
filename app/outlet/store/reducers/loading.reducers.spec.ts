import { initialLoadingStatusState, LoadingStatusState } from './loading.reducers';
import * as fromLoadingStatus from './loading.reducers';
import { OutletActions } from '../actions';
import { getProfile } from '../../models/outlet-profile.mock';
import { CountryState } from './country.reducers';

describe('loading reducer suite', () => {
  test('should not change state for unknown action', () => {
    const stateBefore: LoadingStatusState = {
      ...initialLoadingStatusState,
      isProfileLoading: true
    };
    const action: any = {};
    const state = fromLoadingStatus.reducer(stateBefore, action);
    expect(state).toStrictEqual(stateBefore);
  });

  test('should change state for loadOutletProfile action', () => {
    const stateExpected: LoadingStatusState = {
      ...initialLoadingStatusState,
      isProfileLoading: true
    };
    const action = OutletActions.loadOutletProfile({
      outletId: 'any_id'
    });
    const state = fromLoadingStatus.reducer(initialLoadingStatusState, action);
    expect(state).toStrictEqual(stateExpected);
  });

  test('should change state for loadOutletProfileSuccess action', () => {
    const stateBefore: LoadingStatusState = {
      ...initialLoadingStatusState,
      isProfileLoading: true
    };
    const action = OutletActions.loadOutletProfileSuccess({
      profile: getProfile(),
      country: getCountry(),
      languageId: 'any_id'
    });
    const state = fromLoadingStatus.reducer(stateBefore, action);
    expect(state.isProfileLoading).toStrictEqual(false);
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
