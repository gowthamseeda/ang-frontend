import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';

export const loadUserSettingsSuccess = createAction(
  '[UserSetting Service] Load UserSetting Success',
  props<{ languageId: string }>()
);
export const loadUserSettingsFailure = createAction(
  '[UserSetting Service] Load UserSetting Failure',
  props<{ error: ApiError }>()
);
