import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../store';
import * as fromCountryStructure from '../country-structure-description/store/reducers';
import { CountryStructureDescriptionState } from '../country-structure-description/store/state.model';
import { OutletStructureState } from '../outlet-structure/store/reducers';
import * as fromOutletStructure from '../outlet-structure/store/reducers';
import { RegionalCenterState } from '../regional-center/model/regional-center-state.model';
import * as fromRegionalCenter from '../regional-center/store/reducers';

export interface StructuresState {
  countryStructureDescription: CountryStructureDescriptionState;
  outletStructure: OutletStructureState;
  regionalCenter: RegionalCenterState;
}

export interface State extends fromRoot.State {
  structures: StructuresState;
}

export const selectStructuresState = createFeatureSelector< StructuresState>('structures');

export function reducers(state: StructuresState | undefined, action: Action): any {
  return combineReducers({
    countryStructureDescription: fromCountryStructure.reducers,
    outletStructure: fromOutletStructure.reducers,
    regionalCenter: fromRegionalCenter.reducers
  })(state, action);
}
