import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';

export const loadBrands = createAction(
  '[Legal-Structure-Guard] Load Brand Codes',
  props<{ outletId: string }>()
);

export const loadBrandsSuccess = createAction(
  '[BrandCodeService] Load Brand Codes Success',
  props<{ brandIds: string[] }>()
);

export const loadBrandsFailure = createAction(
  '[BrandCodeService] Load Brand Codes Failure',
  props<{ error: ApiError }>()
);
