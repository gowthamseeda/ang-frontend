import { createFeatureSelector } from '@ngrx/store';

import { ContractState, featureKey } from '../reducers';

export const selectContractState = createFeatureSelector<ContractState>(featureKey);
