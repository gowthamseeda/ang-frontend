import { createSelector } from '@ngrx/store';

import { OutletStructureState } from '../reducers';

import { selectOutletStructure } from './outlet-structure.selectors';

export const selectCompany = createSelector(
  selectOutletStructure,
  (state: OutletStructureState) => {
    return state.company;
  }
);
