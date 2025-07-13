import { createReducer, on } from '@ngrx/store';

import { OutletStructureActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(OutletStructureActions.loadOutletStructureSuccess, (state, { outletStructure }) => ({
    ...outletStructure
  }))
);
