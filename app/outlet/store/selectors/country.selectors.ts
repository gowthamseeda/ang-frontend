import { createSelector } from '@ngrx/store';

import { OutletState, selectOutletState } from '../reducers';

export const selectCountry = createSelector(selectOutletState, (outletState: OutletState) => {
  return outletState.country;
});
