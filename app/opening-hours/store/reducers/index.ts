import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';
import * as fromRoot from '../../../store';
import { LoadingStatus } from '../../models/loading-status.model';
import { SpecialOpeningHour, StandardOpeningHour } from '../../models/opening-hour.model';
import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { SavingStatus } from '../../models/saving-status.model';

import * as fromHours from './brand-product-group-opening-hours.reducers';
import * as fromLoadingStatus from './loading.reducers';
import * as fromOutlet from './outlet.reducers';
import * as fromPermissions from './permission.reducers';
import * as fromSavingStatus from './saving.reducers';
import * as fromSelectedSpecialOpeningHours from './selected-special-opening-hours.reducers';
import * as fromService from './service.reducers';

export interface Service extends Translatable {
  serviceId: number;
  productCategoryId: string;
  serviceCharacteristicsId: string;
  serviceName: string;
  serviceCharacteristicName: string;
  translations?: { [key: string]: any };
}

export interface Hours {
  standardOpeningHours: StandardOpeningHour[];
  specialOpeningHours: SpecialOpeningHour[];
  dataChangeTaskPresent?: boolean;
  verificationTaskPresent?: boolean;
}

export interface Outlet {
  businessSiteId: string;
  countryId: string;
}

export interface OpeningHoursState {
  service: Service;
  hours: Hours;
  outlet: Outlet;
  loadingStatus: LoadingStatus;
  savingStatus: SavingStatus;
  selectedSpecialOpeningHoursStart: number;
  permissions: OpeningHoursPermissions;
}

export const selectOpeningHoursState = createFeatureSelector< OpeningHoursState>(
  'openingHours'
);

export interface State extends fromRoot.State {
  openingHours: OpeningHoursState;
}

export function reducers(state: OpeningHoursState | undefined, action: Action): any {
  return combineReducers({
    service: fromService.reducer,
    hours: fromHours.reducer,
    outlet: fromOutlet.reducer,
    loadingStatus: fromLoadingStatus.reducer,
    savingStatus: fromSavingStatus.reducer,
    selectedSpecialOpeningHoursStart: fromSelectedSpecialOpeningHours.reducer,
    permissions: fromPermissions.reducer
  })(state, action);
}
