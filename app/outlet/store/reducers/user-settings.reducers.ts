import { createReducer, on } from '@ngrx/store';

import { OutletActions } from '../actions';

export interface UserSettingsState {
  languageId?: string;
}

export const initialUserSettingsState: UserSettingsState = {
  languageId: ''
};

export const reducer = createReducer(
  initialUserSettingsState,
  on(OutletActions.loadOutletProfileSuccess, (state, { languageId }) => ({
    ...state,
    languageId: languageId
  }))
);
