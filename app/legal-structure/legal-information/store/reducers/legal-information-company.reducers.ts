import { createReducer, on } from '@ngrx/store';

import { LegalInformationActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(LegalInformationActions.loadLegalInformationSuccess, (state, { companyLegalInfo }) => ({
    ...companyLegalInfo
  })),
  on(LegalInformationActions.updateLegalCompany, (state, { legalFooter, vatNumber }) => {
    const additionalTranslations = {};
    legalFooter.additionalTranslations?.forEach((value, key) => {
      additionalTranslations[key] = value;
    });
    return {
      ...state,
      companyVatNumber: vatNumber,
      legalFooter: legalFooter.text,
      legalFooterAdditionalTranslations: additionalTranslations
    };
  })
);
