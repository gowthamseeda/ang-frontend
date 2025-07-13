import { createAction, props } from '@ngrx/store';

export const loadServiceVariants = createAction(
  '[Service Variant Service] Load Service Variants',
  props<{
    outletId: string;
  }>()
);
