import { createSelector } from '@ngrx/store';

import { selectLegalStructureState } from '../../../store';
import { ViewEventStatus } from '../../model/legal-information.model';

export const selectLegalInformation = createSelector(
  selectLegalStructureState,
  legalStructureState => {
    return legalStructureState.legalInformation;
  }
);

export const selectInitializedState = createSelector(
  selectLegalInformation,
  legalInformationState => {
    return legalInformationState.savingStatus.contentStatus !== ViewEventStatus.DEFAULT;
  }
);

export const selectLegalInfoCompany = createSelector(
  selectLegalInformation,
  legalInformationState => {
    return legalInformationState.companyLegalInfo;
  }
);

export const selectLegalInfoBusinessSite = createSelector(
  selectLegalInformation,
  legalInformationState => {
    return legalInformationState.businessSiteLegalInfo;
  }
);

export const selectLegalContracts = createSelector(
  selectLegalInformation,
  legalInformationState => {
    return legalInformationState.contracts;
  }
);
