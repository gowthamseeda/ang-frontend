import { createAction, props } from '@ngrx/store';

import { SisterOutlet } from '../../../shared/models/sister-outlet.model';
import { OfferedService } from '../../offered-service.model';

export const loadOfferedServicesSuccess = createAction(
  '[Offered Service API] Load Offered Services Success',
  props<{ offeredServices: OfferedService[] }>()
);

export const loadOfferedServicesError = createAction(
  '[Offered Service API] Load Offered Services Error',
  props<{ error: any }>()
);

export const saveOfferedServicesSuccess = createAction(
  '[Offered Service API] Save Offered Services Success'
);

export const saveOfferedServicesError = createAction(
  '[Offered Service API] Save Offered Services Error',
  props<{ error: any }>()
);

export const saveOfferedServiceValiditiesSuccess = createAction(
  '[Offered Service API] Save Offered Service Validities Success'
);

export const saveOfferedServiceValiditiesError = createAction(
  '[Offered Service API] Save Offered Service Validities Error',
  props<{ error: any }>()
);

export const queryCompanySisterOutletSuccess = createAction(
  '[Offered Service API] Query Company Sister Outlet Success',
  props<{ sisterOutlets: SisterOutlet[], offeredServices: OfferedService[] }>()
);

export const saveOfferedServiceValiditiesForMultipleOutletsSuccess = createAction(
  '[Offered Service API] Save Offered Service Validities For Multiple Outlets Success'
);

export const saveOfferedServiceValiditiesForMultipleOutletsError = createAction(
  '[Offered Service API] Save Offered Service Validities For Multiple Outlets Error',
  props<{ error: any }>()
);

