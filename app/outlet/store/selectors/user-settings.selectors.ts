import { createSelector } from '@ngrx/store';

import { OutletState, selectOutletState } from '../reducers';

export const selectUserSettings = createSelector(selectOutletState, (outletState: OutletState) => {
  return outletState.userSettings;
});
