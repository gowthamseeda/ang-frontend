import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromCountry from '../reducers/country.reducers';
import { CountryState } from '../reducers/country.reducers';
import * as fromOutletLoading from '../reducers/loading.reducers';
import { LoadingStatusState } from '../reducers/loading.reducers';
import * as fromOutlet from '../reducers/outlet.reducers';
import { OutletProfileState } from '../reducers/outlet.reducers';
import * as fromUserSettings from '../reducers/user-settings.reducers';
import { UserSettingsState } from '../reducers/user-settings.reducers';

export interface OutletState {
  profile: OutletProfileState;
  country: CountryState;
  userSettings: UserSettingsState;
  loadingStatus: LoadingStatusState;
}

export interface State extends fromRoot.State {
  outlet: OutletState;
}

export const selectOutletState = createFeatureSelector< OutletState>('outlet');

export function reducers(state: OutletState | undefined, action: Action): any {
  return combineReducers({
    profile: fromOutlet.reducer,
    country: fromCountry.reducer,
    userSettings: fromUserSettings.reducer,
    loadingStatus: fromOutletLoading.reducer
  })(state, action);
}
