import { createAction, props } from '@ngrx/store';

import { Address } from '../../model/address.model';
import { BusinessSite } from '../../model/business-site.model';
import { Contract } from '../../model/contract.model';
import { OfferedService } from '../../model/offered-service.model';

export const loadContractsSuccess = createAction(
  '[Contracts Effect] Load Contracts Success',
  props<{ contracts: Contract[] }>()
);

export const loadContractsFailure = createAction(
  '[Contracts Effect] Load Contracts Failure',
  props<{ error: any }>()
);

export const loadOfferedServicesSuccess = createAction(
  '[Contracts Effect] Load OfferedServices Success',
  props<{ offeredServices: OfferedService[] }>()
);

export const loadOfferedServicesFailure = createAction(
  '[Contracts Effect] Load OfferedServices Failure',
  props<{ error: any }>()
);

export const loadContracteeOfChangedContractsSuccess = createAction(
  '[Contracts Effect] Load Contractee of changed Contracts Success',
  props<{ contractEntityIds: string[]; contractee: BusinessSite & Address }>()
);

export const loadContracteeOfChangedContractsFailure = createAction(
  '[Contracts Effect] Load Contractee of changed Contracts Failure',
  props<{ error: any }>()
);

export const loadContracteeOfNewContractsSuccess = createAction(
  '[Contracts Effect] Load Contractee of new Contracts Success',
  props<{ contracts: Contract[] }>()
);

export const loadContracteeOfNewContractsFailure = createAction(
  '[Contracts Effect] Load Contractee of new Contracts Failure',
  props<{ error: any }>()
);

export const saveContractsSuccess = createAction('[Contracts Effect] Save Contracts Success');

export const saveContractsFailure = createAction(
  '[Contracts Effect] Save Contracts Failure',
  props<{ error: any }>()
);
