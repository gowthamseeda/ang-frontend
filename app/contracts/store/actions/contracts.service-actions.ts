import { createAction, props } from '@ngrx/store';

import { BusinessSite } from '../../model/business-site.model';
import { Company } from '../../model/company.model';
import { OfferedService } from '../../model/offered-service.model';

export interface AddContract {
  contractor: BusinessSite & Company;
  contracteeId: string;
  offeredService: OfferedService;
}

export const loadContracts = createAction(
  '[Contracts Service] Load Contracts',
  props<{ contractorId: string }>()
);

export const loadOfferedServices = createAction(
  '[Contracts Service] Load Offered Services',
  props<{ contractorId: string }>()
);

export const updateContracts = createAction(
  '[Contracts Service] Update Contracts',
  props<{ contractEntityIds: string[]; contracteeId: string }>()
);

export const addContracts = createAction(
  '[Contracts Service] Add Contracts',
  props<{ contracts: AddContract[] }>()
);

export const removeContracts = createAction(
  '[Contracts Service] Remove Contracts',
  props<{ contractEntityIds: string[] }>()
);

export const saveContracts = createAction(
  '[Contracts Service] Save Contracts',
  props<{ contractorId: string }>()
);
