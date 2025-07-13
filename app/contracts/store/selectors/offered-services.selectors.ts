import { createSelector } from '@ngrx/store';

import { OfferedService } from '../../../services/offered-service/offered-service.model';
import { ContractState } from '../reducers';
import { adapter } from '../reducers/offered-services.reducer';

import { selectContractState } from './index';

export const selectOfferedServiceSubState = createSelector(
  selectContractState,
  (state: ContractState) => state.offeredService
);

const entitySelectors = adapter.getSelectors(selectOfferedServiceSubState);

export const selectAll = createSelector(
  entitySelectors.selectAll,
  (offeredServices: OfferedService[]) => offeredServices
);
