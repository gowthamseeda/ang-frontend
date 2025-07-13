import { createAction, props } from '@ngrx/store';

import { ServiceVariant } from '../../../service-variant/service-variant.model';

export const loadServiceVariantsSuccess = createAction(
  '[Service Variant API] Load Service Variant Success',
  props<{ serviceVariants: ServiceVariant[] }>()
);

export const loadServiceVariantsError = createAction(
  '[Service Variant API] Load Service Variant Error',
  props<{ error: any }>()
);
