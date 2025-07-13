import { createReducer, on } from '@ngrx/store';

import { OutletActions } from '../../../businessSite/store/actions';
import { ViewEventStatus } from '../../model/legal-information.model';
import { ContractStatusActions, LegalInformationActions, SavingStatusActions } from '../actions';
import { SavingStatusState } from '../state.model';

export const initialState: SavingStatusState = {
  contentStatus: ViewEventStatus.DEFAULT
};

export const reducer = createReducer(
  initialState,
  on(
    LegalInformationActions.loadLegalInformationSuccess,
    ContractStatusActions.loadContractStatusSuccess,
    (state, {}) => ({
      contentStatus: ViewEventStatus.CONTENT_LOADED
    })
  ),
  on(
    LegalInformationActions.loadLegalInformationFailure,
    LegalInformationActions.saveLegalInformationFailure,
    ContractStatusActions.loadContractStatusFailure,
    ContractStatusActions.saveContractStatusFailure,
    (state, {}) => ({
      contentStatus: ViewEventStatus.ERROR
    })
  ),
  on(
    ContractStatusActions.addContractStatus,
    ContractStatusActions.updateContractStatus,
    ContractStatusActions.removeContractStatus,
    LegalInformationActions.updateLegalCompany,
    LegalInformationActions.updateLegalBusinessSite,
    (state, {}) => ({
      contentStatus: ViewEventStatus.CONTENT_CHANGED
    })
  ),
  on(OutletActions.loadOutlet, SavingStatusActions.resetSavingStatus, (state, {}) => ({
    ...initialState
  }))
);
