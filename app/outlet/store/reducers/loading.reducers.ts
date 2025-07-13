import { createReducer, on } from '@ngrx/store';

import { OutletActions } from '../actions';

export interface LoadingStatusState {
  isProfileLoading: boolean;
  isError: boolean;
  errorMsg: string;
}

export const initialLoadingStatusState: LoadingStatusState = {
  isProfileLoading: true,
  isError: false,
  errorMsg: ''
};

export const reducer = createReducer(
  initialLoadingStatusState,
  on(OutletActions.loadOutletProfile, state => ({
    ...state,
    isProfileLoading: true,
    isError: false,
    errorMsg: ''
  })),
  on(OutletActions.loadOutletProfileSuccess, state => ({
    ...state,
    isProfileLoading: false
  })),
  on(OutletActions.loadOutletProfileFailure, (state, { error }) => ({
    ...state,
    isProfileLoading: false,
    isError: true,
    errorMsg: `${error.message} (${error.traceId})`
  }))
);
