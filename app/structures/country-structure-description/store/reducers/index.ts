import { Action, combineReducers } from '@ngrx/store';

import { CountryStructureDescriptionState } from '../state.model';

import * as fromCountryStructureDescriptions from './country-structure-description.reducers';

export const initialState: CountryStructureDescriptionState = {
  countryStructureDescriptions: fromCountryStructureDescriptions.initialState
};

export function reducers(
  countryStructureDescriptionState: CountryStructureDescriptionState | undefined,
  action: Action
): any {
  return combineReducers({
    countryStructureDescriptions: fromCountryStructureDescriptions.reducer
  })(countryStructureDescriptionState, action);
}
