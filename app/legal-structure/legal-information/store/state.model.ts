import { LegalContract, ViewEventStatus } from '../model/legal-information.model';

export enum LegalContractStatus {
  CREATED = 1,
  UPDATED = 2,
  REMOVED = 3,
  DEFAULT = 4
}

export interface CompanyInfoState {
  companyVatNumber: string;
  legalFooter: string;
  legalFooterAdditionalTranslations: { [key: string]: string };
}

export interface BusinessSiteInfoState {
  nationalTaxNumber: string;
}

export interface ContractState extends LegalContract {
  status: LegalContractStatus;
}

export interface SavingStatusState {
  contentStatus: ViewEventStatus;
}

export interface LegalInformationState {
  businessSiteLegalInfo: BusinessSiteInfoState | undefined;
  companyLegalInfo: CompanyInfoState | undefined;
  contracts: ContractState[];
  savingStatus: SavingStatusState;
}
