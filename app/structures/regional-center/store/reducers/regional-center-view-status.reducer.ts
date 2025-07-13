import { createReducer, on } from '@ngrx/store';

import { ViewStatus } from '../../model/regional-center-state.model';
import { RegionalCenterActions } from '../actions';

export const initialState: ViewStatus = {
  error: undefined,
  errorMsg: ''
};

export const reducer = createReducer(
  initialState,
  on(RegionalCenterActions.loadRegionalCentersSuccess, state => {
    return {
      ...state,
      error: false,
      errorMsg: ''
    };
  }),
  on(RegionalCenterActions.loadRegionalCenterFailure, (state, { error }) => {
    return {
      ...state,
      error: true,
      errorMsg: `${error.message} (${error.traceId})`
    };
  })
);
