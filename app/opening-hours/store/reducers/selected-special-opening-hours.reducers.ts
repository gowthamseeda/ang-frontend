import { createReducer, on } from '@ngrx/store';

import { BrandProductGroupOpeningHoursActions, SelectedOpeningHoursActions } from '../actions';

export const initialState = -1;

export const reducer = createReducer(
  initialState,
  on(
    SelectedOpeningHoursActions.updateSelectedSpecialOpeningHours,
    (state, { startDate }) => startDate
  ),
  on(
    SelectedOpeningHoursActions.closeSelectedSpecialOpeningHours,
    BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess,
    state => initialState
  )
);
