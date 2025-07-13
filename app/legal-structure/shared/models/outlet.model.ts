import { TaskData } from 'app/tasks/task.model';

import { CloseDownReason } from '../../close-down-reasons/close-down-reason.model';

import { Address, OutletAddressTranslation } from './address.model';
import { GPS } from './gps.model';
import { POBox, POBoxTranslation } from './po-box.model';

export interface Outlet {
  active?: boolean;
  legalName: string;
  nameAddition?: string;
  companyLegalName: string;
  companyId: string;
  countryId: string;
  state?: string;
  province?: string;
  address: Address;
  additionalAddress?: Address;
  gps?: GPS;
  poBox?: POBox;
  defaultLanguageId?: string;
  additionalTranslations?: { [key: string]: OutletTranslation };
  id: string;
  countryName?: string;
  registeredOffice?: boolean;
  companysRegisteredOfficeId?: string;
  registeredOfficeId?: string;
  affiliate: boolean;
  status?: string;
  startOperationDate?: Date;
  closeDownDate?: Date;
  closeDownReason?: CloseDownReason;
  hasAssignableLabels?: boolean;
  taskData?: TaskData;
}

export interface OutletTranslation {
  legalName?: string;
  nameAddition?: string;
  address?: OutletAddressTranslation;
  additionalAddress?: OutletAddressTranslation;
  poBox?: POBoxTranslation;
  state?: string;
  province?: string;
}
