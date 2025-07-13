import { createReducer, on } from '@ngrx/store';

import { RegionalCenter } from '../../model/regional-center.model';
import { RegionalCenterActions } from '../actions';

export const initialState: RegionalCenter[] = [];

export const reducer = createReducer(
  initialState,
  on(RegionalCenterActions.loadRegionalCentersSuccess, (state, { regionalCenters }) => {
    return regionalCenters;
  })
);
