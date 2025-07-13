import { createAction, props } from '@ngrx/store';

import {
  MultiOfferedService,
  OfferedServiceValidity,
  ValidityChange
} from '../../../validity/validity.model';
import { OfferedService } from '../../offered-service.model';

export const loadOfferedServices = createAction(
  '[Offered Service Service] Load Offered Services',
  props<{ outletId: string }>()
);

export const resetOfferedServices = createAction(
  '[Offered Service Service] Reset Offered Services'
);

export const addOfferedService = createAction(
  '[Offered Service Service] Add Offered Service',
  props<{ offeredService: OfferedService }>()
);

export const removeOfferedService = createAction(
  '[Offered Service Service] Remove Offered Service',
  props<{ id: string }>()
);

export const saveOfferedServices = createAction(
  '[Offered Service Service] Save Offered Services',
  props<{ outletId: string }>()
);

export const toggleOnlineOnly = createAction(
  '[Offered Service Service] Update OnlineOnly',
  props<{ id: string; onlineOnly: boolean }>()
);

export const updateModelSeriesIds = createAction(
  '[Offered Service Service] Update Model Series Ids',
  props<{ id: string; modelSeriesIds: string[] }>()
);

export const updateSeriesIds = createAction(
  '[Offered Service Service] Update Series Ids',
  props<{ id: string; seriesIds: number[] }>()
);

export const updateApplicationValidity = createAction(
  '[Offered Service Validity Service] Update Application',
  props<{ ids: string[]; application?: boolean }>()
);

export const updateApplicationUntilValidity = createAction(
  '[Offered Service Validity Service] Update Application Until Validity',
  props<{ ids: string[]; applicationValidUntil?: string | null }>()
);

export const updateValidFromValidity = createAction(
  '[Offered Service Validity Service] Update Valid From Validity',
  props<{ ids: string[]; validFrom?: string | null }>()
);

export const updateValidUntilValidity = createAction(
  '[Offered Service Validity Service] Update Valid Until Validity',
  props<{ ids: string[]; validUntil?: string | null }>()
);

export const updateValidity = createAction(
  '[Offered Service Validity Service] Update Validity',
  props<{ validityChange: ValidityChange }>()
);

export const saveOfferedServiceValidities = createAction(
  '[Offered Service Validity Service] Save Offered Service Validities',
  props<{ outletId: string; validities: OfferedServiceValidity[] }>()
);

export const queryCompanySisterOutlet = createAction(
  '[Offered Service Service] Query Company Sister Outlet',
  props<{ companyId: string; serviceIds: number[] }>()
);

export const saveOfferedServiceValiditiesForMultipleOutlets = createAction(
  '[Offered Service Validity Service] Save Offered Service Validities For Multiple Outlets',
  props<{ multiOfferedService: MultiOfferedService[] }>()
);
