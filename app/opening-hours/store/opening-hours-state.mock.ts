import { OpeningHoursState } from './reducers';
import { initialState as initialHoursState } from './reducers/brand-product-group-opening-hours.reducers';
import { initialState as initialStateLoad } from './reducers/loading.reducers';
import { initialState as initialOutletState } from './reducers/outlet.reducers';
import { initialState as initialPermissionsState } from './reducers/permission.reducers';
import { initialState as initialSaveState } from './reducers/saving.reducers';
import { initialState as initialSelectedSpecialOpeningHoursStart } from './reducers/selected-special-opening-hours.reducers';
import { initialState as initialServiceState } from './reducers/service.reducers';

export function getInitialState(): OpeningHoursState {
  return {
    service: initialServiceState,
    hours: initialHoursState,
    outlet: initialOutletState,
    loadingStatus: initialStateLoad,
    savingStatus: initialSaveState,
    selectedSpecialOpeningHoursStart: initialSelectedSpecialOpeningHoursStart,
    permissions: initialPermissionsState
  };
}
