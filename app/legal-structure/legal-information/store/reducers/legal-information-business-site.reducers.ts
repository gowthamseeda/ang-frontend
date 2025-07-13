import { createReducer, on } from '@ngrx/store';

import { LegalInformationActions } from '../actions';

const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(LegalInformationActions.loadLegalInformationSuccess, (state, { businessSiteLegalInfo }) => ({
    ...businessSiteLegalInfo
  })),
  on(LegalInformationActions.updateLegalBusinessSite, (state, { nationalTaxNumber }) => ({
    ...state,
    nationalTaxNumber: nationalTaxNumber
  }))
);
