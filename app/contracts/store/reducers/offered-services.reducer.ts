import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { OfferedService } from '../../model/offered-service.model';
import { ContractsEffectActions } from '../actions';

export interface OfferedServiceSubState extends EntityState<OfferedService> {}

export const adapter: EntityAdapter<OfferedService> = createEntityAdapter<OfferedService>({
  selectId: (offeredService: OfferedService) => offeredService.id
});
export const initialState: OfferedServiceSubState = adapter.getInitialState();

export const reducer = createReducer(
  initialState,
  on(ContractsEffectActions.loadOfferedServicesSuccess, (state, { offeredServices }) =>
    adapter.setAll(offeredServices, state)
  )
);
