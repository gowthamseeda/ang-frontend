import { createReducer, on } from '@ngrx/store';

import { OutletStructureActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(
    OutletStructureActions.loadOutletStructures,
    OutletStructureActions.removeSublets,
    OutletStructureActions.createMarketStructure,
    OutletStructureActions.moveSubletTo,
    OutletStructureActions.deleteFromMarketStructure,
    () => ({
      isOutletStructureLoading: true,
      isError: false,
      errorMsg: ''
    })
  ),
  on(OutletStructureActions.loadOutletStructureSuccess, state => {
    if (state) {
      return { ...state, isOutletStructureLoading: false };
    }

    return state;
  }),
  on(OutletStructureActions.loadOutletStructureFailure, (state, { error }) => {
    if (state) {
      return {
        ...state,
        isOutletStructureLoading: false,
        isError: true,
        errorMsg: `${error.message} (${error.traceId})`
      };
    }

    return state;
  })
);
