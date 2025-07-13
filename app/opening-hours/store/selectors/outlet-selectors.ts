import { createSelector } from '@ngrx/store';

import { OpeningHoursState, Outlet, selectOpeningHoursState } from '../reducers';

export const selectOutlet = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => state.outlet
);

export const selectCountryId = createSelector(selectOutlet, (outlet: Outlet) => outlet.countryId);
