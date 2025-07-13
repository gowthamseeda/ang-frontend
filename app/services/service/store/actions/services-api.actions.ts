import { createAction, props } from '@ngrx/store';

import { Service } from '../../models/service.model';

export const loadServicesSuccess = createAction(
  '[Service API] Load Services Success',
  props<{ services: Service[] }>()
);

export const loadServicesError = createAction(
  '[Service API] Load Services Error',
  props<{ error: any }>()
);

export const loadServiceSuccess = createAction(
  '[Service API] Load Service Success',
  props<{ service: Service }>()
);

export const loadServiceError = createAction(
  '[Service API] Load Service Error',
  props<{ error: any }>()
);
