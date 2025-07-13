import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../store';
import * as fromBusinessSite from '../businessSite/store/reducers';
import { BusinessSiteState } from '../businessSite/store/state.model';
import * as fromLegalInformation from '../legal-information/store/reducers';
import { LegalInformationState } from '../legal-information/store/state.model';

export interface LegalStructureState {
  businessSiteState: BusinessSiteState;
  legalInformation: LegalInformationState;
}

export interface State extends fromRoot.State {
  legalStructure: LegalStructureState;
}

export const selectLegalStructureState = createFeatureSelector< LegalStructureState>(
  'legalStructure'
);

export function reducers(state: LegalStructureState | undefined, action: Action): any {
  return combineReducers({
    businessSiteState: fromBusinessSite.reducers,
    legalInformation: fromLegalInformation.reducers
  })(state, action);
}
