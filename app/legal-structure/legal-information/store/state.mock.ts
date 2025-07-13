import {
  getLegalContract_MB_NotRequired,
  getLegalContract_MB_Required_De
} from '../model/legal-information.mock';
import { ViewEventStatus } from '../model/legal-information.model';

import { ContractState, LegalContractStatus, LegalInformationState } from './state.model';

export function getLegalInformationState_fully_initialized(): LegalInformationState {
  return {
    businessSiteLegalInfo: {
      nationalTaxNumber: 'tax12345678'
    },
    companyLegalInfo: {
      companyVatNumber: 'vat12345678',
      legalFooter: 'My legal footer',
      legalFooterAdditionalTranslations: getAdditionalTranslations_deCH()
    },
    contracts: [getContractState_MB_NotRequired(), getContractState_MB_Required_De()],
    savingStatus: {
      contentStatus: ViewEventStatus.CONTENT_LOADED
    }
  };
}

export function getAdditionalTranslations_deCH(): { [key: string]: string } {
  return {
    'de-CH': 'My swizz footer'
  };
}

export function getContractState_MB_NotRequired(): ContractState {
  return {
    ...getLegalContract_MB_NotRequired(),
    status: LegalContractStatus.DEFAULT
  };
}

export function getContractState_MB_Required_De(): ContractState {
  return {
    ...getLegalContract_MB_Required_De(),
    status: LegalContractStatus.DEFAULT
  };
}
