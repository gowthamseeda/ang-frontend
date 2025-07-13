import { TaskData } from 'app/tasks/task.model';

import { ApiError } from '../../../../shared/services/api/api.service';
import { LegalContract } from '../../model/legal-information.model';
import { BusinessSiteInfoState, CompanyInfoState, ContractState } from '../state.model';

import * as ContractStatusActions from './contract-status.actions';
import * as LegalInformationActions from './legal-information.actions';
import * as SavingStatusActions from './saving-status.actions';

export { LegalInformationActions, ContractStatusActions, SavingStatusActions };

export interface LoadLegalInformationPayload {
  outletId: string;
  companyId: string;
}

export interface LoadLegalInformationSuccessPayload {
  businessSiteId: string;
  businessSiteLegalInfo: BusinessSiteInfoState;
  companyLegalInfo: CompanyInfoState;
}

export interface SaveLegalInformationSuccessPayload {
  businessSiteId: string;
  correlationId: number;
  companyId: string;
}

export interface LoadContractStatusSuccessPayload {
  legalContracts: ContractState[];
}

export interface SaveContractStatusSuccessPayload {
  correlationId: number;
}

export interface SaveContractStatusPayload {
  correlationId: number;
  businessSiteId: string;
  contractStatus: ContractState[];
}

export interface SaveLegalInformationPayload {
  correlationId: number;
  businessSiteId: string;
  companyId: string;
  companyVatNumber: string;
  legalFooter: string;
  legalFooterAdditionalTranslations: { [key: string]: string };
  nationalTaxNumber: string;
  taskData?: TaskData;
}

export interface UpdateContractStatusPayload {
  legalContract: LegalContract;
}

export interface RemoveContractStatusPayload {
  contractId: number;
}

export interface FailurePayload {
  error: ApiError;
}
