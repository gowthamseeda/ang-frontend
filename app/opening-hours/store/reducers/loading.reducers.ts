import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '../../models/loading-status.model';
import {
  brandProductGroupOpeningHoursLoadSuccess,
  openingHoursApiFailure,
  openingHoursLoad
} from '../actions/brand-product-group-opening-hours.actions';

export const initialState: LoadingStatus = {
  isOpeningHoursLoading: true,
  isError: false,
  errorMsg: ''
};

export const reducer = createReducer(
  initialState,
  on(openingHoursLoad, state => ({
    ...state,
    isError: false,
    errorMsg: '',
    errorStatus: undefined
  })),
  on(brandProductGroupOpeningHoursLoadSuccess, state => ({
    ...state,
    isOpeningHoursLoading: false
  })),
  on(openingHoursApiFailure, (state, { error }) => ({
    ...state,
    isOpeningHoursLoading: false,
    isError: true,
    errorMsg: `${error.message} (${error.traceId})`,
    errorStatus: error.state ? error.state : undefined
  }))
);
