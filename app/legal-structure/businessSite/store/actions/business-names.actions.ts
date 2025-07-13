import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';

export const loadBusinessNames = createAction(
  '[Legal-Structure-Guard] Load Business-Names',
  props<{ outletId: string }>()
);

export const loadBusinessNamesSuccess = createAction(
  '[BusinessNamesService] Load Business-Names Success',
  props<{ businessNames: string[] }>()
);

export const loadBusinessNamesFailure = createAction(
  '[BusinessNamesService] Load Business-Names Failure',
  props<{ error: ApiError }>()
);
