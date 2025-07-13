import { createAction, props } from '@ngrx/store';

export const updateSelectedSpecialOpeningHours = createAction(
  '[User Action] update selected special opening hours start date',
  props<{ startDate: number }>()
);

export const closeSelectedSpecialOpeningHours = createAction(
  '[User Action] close selected special opening hours'
);
