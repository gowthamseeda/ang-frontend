import { createReducer, on } from '@ngrx/store';

import { SisterOutlet } from '../../../shared/models/sister-outlet.model';
import { OfferedServiceApiActions } from '../actions';
import { OfferedService } from '../../offered-service.model';

export interface SisterOutletState {
  sisterOutlets: SisterOutlet[];
  offeredServices: OfferedService[];
}

export const initialSisterOutletState: SisterOutletState = {
  sisterOutlets: [],
  offeredServices: []
};

export const reducer = createReducer(
  initialSisterOutletState,
  on(OfferedServiceApiActions.queryCompanySisterOutletSuccess, (state, { sisterOutlets , offeredServices}) => ({
    ...state,
    sisterOutlets,
    offeredServices
  }))
);
