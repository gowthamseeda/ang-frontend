import { createSelector } from '@ngrx/store';

import { OutletProfileState } from '../reducers/outlet.reducers';

import { selectOutletProfileState } from './outlet-profile.selectors';

export const selectOpeningHours = createSelector(
  selectOutletProfileState,
  (outletProfileState: OutletProfileState) => {
    return outletProfileState.openingHours;
  }
);
