import { Action, combineReducers } from '@ngrx/store';

import { Company } from '../../model/company.model';
import {
  LoadingStatus,
  OutletStructure,
  OutletStructureOutlets
} from '../../model/outlet-structure.model';

import * as fromCompany from './company.reducers';
import * as fromLoadingStatus from './loading.reducers';
import * as fromOutletStructureSelected from './outlet-structure-selected.reducers';
import * as fromOutletStructure from './outlet-structure.reducers';

export interface OutletStructureState {
  company: Company | undefined;
  structure: OutletStructure | undefined;
  selectedOutlet: OutletStructureOutlets | undefined;
  loadingStatus: LoadingStatus | undefined;
}

export const initialState: OutletStructureState = {
  company: fromCompany.initialState,
  structure: fromOutletStructure.initialState,
  selectedOutlet: fromOutletStructureSelected.initialState,
  loadingStatus: fromLoadingStatus.initialState
};

export function reducers(state: OutletStructureState | undefined, action: Action): any {
  return combineReducers({
    company: fromCompany.reducer,
    structure: fromOutletStructure.reducer,
    selectedOutlet: fromOutletStructureSelected.reducer,
    loadingStatus: fromLoadingStatus.reducer
  })(state, action);
}
