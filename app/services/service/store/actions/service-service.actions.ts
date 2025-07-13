import { createAction, props } from '@ngrx/store';

export const loadServices = createAction('[Service Service] Load Services');

export const loadService = createAction(
  '[Service Service] Load Service',
  props<{ serviceId: number }>()
);

export const setPageIndex = createAction(
  '[Service Service] Set Services Page Index',
  props<{ pageIndex: number }>()
);
