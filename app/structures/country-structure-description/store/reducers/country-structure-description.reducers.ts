import { createReducer, on } from '@ngrx/store';

import { CountryStructureDescription } from '../../model/country-structure-description.model';
import { CountryStructureDescriptionActions } from '../actions';

export const initialState: CountryStructureDescription[] = [];

export const reducer = createReducer(
  initialState,
  on(
    CountryStructureDescriptionActions.loadCountryStructureDescriptionSuccess,
    (stateBefore, { countryStructureDescriptions }) => [...countryStructureDescriptions]
  )
);
