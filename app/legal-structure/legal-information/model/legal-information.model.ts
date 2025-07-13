import { LegalContractSelection } from '../presentational/edit-legal/legal-contract-state-table/legal-contract-state-table.component';

export enum ViewEventStatus {
  DEFAULT = 1,
  CONTENT_LOADED = 2,
  CONTENT_CHANGED = 3,
  ERROR = 4
}

export interface LegalFooter {
  text: string;
  additionalTranslations: Map<string, string>;
}

export interface LegalContract {
  id: number;
  brandId: string;
  companyRelationId?: string;
  required: boolean;
  languageId?: string;
  contractState?: string;
  corporateDisclosure?: string;
}

export interface LegalBusinessSite {
  id: string;
  registeredOffice: boolean;
  hasRequiredDistributionLevel: boolean;
  nationalTaxNumber: string;
  countryId: string;
  defaultLanguageId?: string;
}

export interface LegalCompany {
  id: string;
  vatNumber: string;
  legalFooter: LegalFooter;
}

export interface LegalInformationPermissions {
  restrictedToBrands: LegalContractSelection[];
  restrictedToCompanyRelation: LegalContractSelection[];
  restrictedToBusinessSite: boolean;
  restrictedToCountry: boolean;
  restrictedToDistributionLevel: boolean;
  editLegalInfoIsAllowed: boolean;
  editContractStatusIsAllowed: boolean;
  retailVerifyData: boolean;
  isUserAuthorizedToCreateVerificationTask: boolean;
}

export interface LegalInformation {
  businessSite: LegalBusinessSite;
  company: LegalCompany;
  legalContracts: LegalContract[];
  permissions?: LegalInformationPermissions;
  viewStatus?: ViewEventStatus;
}
