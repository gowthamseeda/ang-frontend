import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';

export const loadDistributionLevels = createAction(
  '[Legal-Structure-Guard] Load Distribution-Levels',
  props<{ outletId: string }>()
);

export const loadDistributionLevelsSuccess = createAction(
  '[DistributionLevelsService] Load Distribution-Levels Success',
  props<{ distributionLevels: string[] }>()
);

export const loadDistributionLevelsFailure = createAction(
  '[DistributionLevelsService] Load Distribution-Levels Failure',
  props<{ error: ApiError }>()
);
