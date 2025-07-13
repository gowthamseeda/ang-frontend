import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '../../store';
import { selectEntityCacheState } from '../../store/entity/state';
import * as fromOfferedService from '../offered-service/store/reducers/offered-service.reducer';
import * as fromServiceVariant from '../service-variant/store/service-variant.reducer';
import * as fromService from '../service/store/service.reducer';
import * as fromSisterOutlet from '../offered-service/store/reducers/sister-outlet.reducer';

export interface ServicesState {
  service: fromService.State;
  offeredService: fromOfferedService.State;
  serviceVariant: fromServiceVariant.State;
  sisterOutlets: fromSisterOutlet.SisterOutletState;
}

export interface State extends fromRoot.State {
  services: ServicesState;
}

export function reducers(state: ServicesState | undefined, action: Action): any {
  return combineReducers({
    service: fromService.reducer,
    offeredService: fromOfferedService.reducer,
    serviceVariant: fromServiceVariant.reducer,
    sisterOutlets: fromSisterOutlet.reducer
  })(state, action);
}

export const selectServicesState = createFeatureSelector<ServicesState>('services');
export const selectBrandProductGroupValidityState = createSelector(
  selectEntityCacheState,
  state => state.BrandProductGroupValidity
);
