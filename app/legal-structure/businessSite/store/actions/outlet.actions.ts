import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';
import { Outlet } from '../../../shared/models/outlet.model';

export const loadOutlet = createAction(
  '[Legal-Structure-Guard] Load Outlet',
  props<{ outletId: string }>()
);

export const loadOutletSuccess = createAction(
  '[Outlet API] Load Outlet Success',
  props<{ outlet: Outlet }>()
);

export const loadOutletFailure = createAction(
  '[Outlet API] Load Outlet Failure',
  props<{ error: ApiError }>()
);

export const toggleOutletAffiliate = createAction(
  '[Outlet API] Toggle Outlet Affiliate',
  props<{ outlet: Outlet }>()
);

export const saveOutletFailure = createAction(
  '[Outlet API] Save Outlet Failure',
  props<{ error: any }>()
);

export const resetBusinessSite = createAction('[User Action] Reset BusinessSite');
