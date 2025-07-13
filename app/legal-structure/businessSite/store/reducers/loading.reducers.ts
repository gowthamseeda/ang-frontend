import { createReducer, on } from '@ngrx/store';

import {
  BrandsActions,
  BusinessNamesActions,
  DistributionLevelActions,
  OutletActions,
  OutletCountryActions,
  UserSettingsActions
} from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(OutletActions.loadOutlet, OutletActions.toggleOutletAffiliate, () => ({
    isOutletLoading: true,
    isError: false,
    errorMsg: ''
  })),
  on(OutletCountryActions.loadCountrySuccess, () => ({
    isOutletLoading: false,
    isError: false,
    errorMsg: ''
  })),
  on(
    OutletActions.loadOutletFailure,
    UserSettingsActions.loadUserSettingsFailure,
    OutletCountryActions.loadCountryFailure,
    BusinessNamesActions.loadBusinessNamesFailure,
    DistributionLevelActions.loadDistributionLevelsFailure,
    BrandsActions.loadBrandsFailure,
    (state, { error }) => ({
      isOutletLoading: false,
      isError: true,
      errorMsg: `${error.message} (${error.traceId})`
    })
  )
);
