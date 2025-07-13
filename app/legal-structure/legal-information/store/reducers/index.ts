import { Action, combineReducers } from '@ngrx/store';

import { LegalInformationState } from '../state.model';

import * as legalContractReducers from './legal-contract.reducers';
import * as legalInfoBusinessSiteReducers from './legal-information-business-site.reducers';
import * as legalInfoCompanyReducers from './legal-information-company.reducers';
import * as savingStatusReducers from './saving-status.reducers';

export const initialState: LegalInformationState = {
  businessSiteLegalInfo: undefined,
  companyLegalInfo: undefined,
  contracts: [...legalContractReducers.initialState],
  savingStatus: { ...savingStatusReducers.initialState }
};

export function reducers(state: LegalInformationState | undefined, action: Action): any {
  return combineReducers({
    businessSiteLegalInfo: legalInfoBusinessSiteReducers.reducer,
    companyLegalInfo: legalInfoCompanyReducers.reducer,
    contracts: legalContractReducers.reducer,
    savingStatus: savingStatusReducers.reducer
  })(state, action);
}
