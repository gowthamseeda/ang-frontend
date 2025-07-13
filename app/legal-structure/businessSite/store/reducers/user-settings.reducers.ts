import { createReducer, on } from '@ngrx/store';

import { UserSettingsActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(UserSettingsActions.loadUserSettingsSuccess, (state, { languageId }) => languageId)
);
