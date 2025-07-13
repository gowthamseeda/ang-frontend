import { createSelector } from '@ngrx/store';

import { selectStructuresState, StructuresState } from '../../../store';
import { CountryStructureDescriptionState } from '../state.model';

export const selectCountryStructureDescriptionState = createSelector(
  selectStructuresState,
  (structureState: StructuresState) => structureState.countryStructureDescription
);

export const selectAllCountryStructureDescriptions = createSelector(
  selectCountryStructureDescriptionState,
  (descriptionState: CountryStructureDescriptionState) =>
    descriptionState.countryStructureDescriptions
);
