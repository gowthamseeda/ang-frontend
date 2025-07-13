import { Action, combineReducers } from '@ngrx/store';

import { BusinessSiteState } from '../state.model';

import * as fromBrands from './brands.reducers';
import * as fromBusinessNames from './business-names.reducers';
import * as fromCountry from './country.reducers';
import * as fromDistributionLevels from './distribution-levels.reducers';
import * as fromLoadingStatus from './loading.reducers';
import * as fromOutlet from './outlet.reducers';
import * as fromUserSettings from './user-settings.reducers';

export const initialState: BusinessSiteState = {
  brandIds: [...fromBrands.initialState],
  businessNames: [...fromBusinessNames.initialState],
  country: fromCountry.initialState,
  distributionLevels: [...fromDistributionLevels.initialState],
  loadingStatus: fromLoadingStatus.initialState,
  outlet: fromOutlet.initialState,
  languageId: fromUserSettings.initialState
};

export function reducers(state: BusinessSiteState | undefined, action: Action): any {
  return combineReducers({
    brandIds: fromBrands.reducer,
    businessNames: fromBusinessNames.reducer,
    country: fromCountry.reducer,
    distributionLevels: fromDistributionLevels.reducer,
    loadingStatus: fromLoadingStatus.reducer,
    outlet: fromOutlet.reducer,
    languageId: fromUserSettings.reducer
  })(state, action);
}
