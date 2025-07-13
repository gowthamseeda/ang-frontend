import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';
import { RegionalCenter } from '../../model/regional-center.model';

export const loadRegionalCenters = createAction('[Regional Centers Page] View regional centers');

export const loadRegionalCentersSuccess = createAction(
  '[Regional Center API] Load all success',
  props<{ regionalCenters: RegionalCenter[] }>()
);

export const loadRegionalCenterFailure = createAction(
  '[Regional Center API] Failure',
  props<{ error: ApiError }>()
);
