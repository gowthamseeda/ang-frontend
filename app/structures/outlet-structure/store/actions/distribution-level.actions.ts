import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';

export const loadDistributionLevelSuccess = createAction(
  '[DistributionLevel Service] Load Success',
  props<{ distributionLevels: string[] }>()
);

export const loadDistributionLevelFailure = createAction(
  '[DistributionLevel Service] Load Failure',
  props<{ error: ApiError }>()
);
