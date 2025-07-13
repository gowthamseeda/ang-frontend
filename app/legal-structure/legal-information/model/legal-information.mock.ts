import { getAdditionalTranslations_deCH } from '../store/state.mock';

import {
  LegalContract,
  LegalInformation,
  LegalInformationPermissions,
  ViewEventStatus
} from './legal-information.model';
import { DataCluster, Status, Task, Type } from "../../../tasks/task.model";

export function getLegalContract_MB_NotRequired(): LegalContract {
  return {
    id: 1,
    brandId: 'MB',
    companyRelationId: 'MBAG',
    required: false,
    contractState: '',
    corporateDisclosure: '',
    languageId: ''
  };
}

export function getLegalContract_MB_Required_De(): LegalContract {
  return {
    id: 2,
    brandId: 'MB',
    companyRelationId: 'MBAG',
    required: true,
    languageId: 'de-DE',
    contractState: 'state-text',
    corporateDisclosure: 'disclosure-text'
  };
}

export function getLegalContract_SMT_Required_De(): LegalContract {
  return {
    id: 3,
    brandId: 'SMT',
    companyRelationId: 'MBAG',
    required: true,
    languageId: 'de-DE',
    contractState: 'state-text',
    corporateDisclosure: 'disclosure-text'
  };
}

export function getOutletLegalInformation_RO(
  outletId?: string,
  companyId?: string
): LegalInformation {
  return {
    company: {
      id: companyId ? companyId : 'GC0000001',
      vatNumber: 'vat12345678',
      legalFooter: {
        text: '',
        additionalTranslations: new Map(Object.entries(getAdditionalTranslations_deCH()))
      }
    },
    businessSite: {
      id: outletId ? outletId : 'GS0000001',
      registeredOffice: true,
      hasRequiredDistributionLevel: true,
      nationalTaxNumber: 'tax12345678',
      countryId: 'DE',
      defaultLanguageId: 'de-DE'
    },
    legalContracts: [getLegalContract_MB_NotRequired(), getLegalContract_MB_Required_De()],
    viewStatus: ViewEventStatus.DEFAULT
  };
}

export function getOutletLegalInformationPermissions(): LegalInformationPermissions {
  return {
    restrictedToBrands: [{ text: 'Mercedes Benz', value: 'MB' }],
    restrictedToCompanyRelation: [],
    restrictedToBusinessSite: true,
    restrictedToCountry: true,
    restrictedToDistributionLevel: true,
    editLegalInfoIsAllowed: true,
    editContractStatusIsAllowed: false,
    retailVerifyData: false,
    isUserAuthorizedToCreateVerificationTask: false
  };
}

export function getOutletLegalInformationNoRestrictionPermissions(): LegalInformationPermissions {
  return {
    restrictedToBrands: [{ text: 'Mercedes Benz', value: 'MB' }],
    restrictedToCompanyRelation: [],
    restrictedToBusinessSite: false,
    restrictedToCountry: true,
    restrictedToDistributionLevel: true,
    editLegalInfoIsAllowed: true,
    editContractStatusIsAllowed: false,
    retailVerifyData: false,
    isUserAuthorizedToCreateVerificationTask: false
  };
}

export function getTaskData(): Task {
  return {
    taskId: 1,
    businessSiteId: '124',
    type: Type.DATA_CHANGE,
    status: Status.OPEN,
    dataCluster: DataCluster.LEGAL_LEGAL_FOOTER,
    creationDate: '2020-01-01T00:00:00.000Z'
  };
}
