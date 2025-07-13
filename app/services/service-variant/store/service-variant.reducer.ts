import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ServiceVariant } from '../service-variant.model';

import { ServiceVariantApiActions, ServiceVariantServiceActions } from './actions';

export interface State extends EntityState<ServiceVariant> {
  loading: boolean;
}

export const adapter: EntityAdapter<ServiceVariant> = createEntityAdapter<ServiceVariant>({
  selectId: (serviceVariant: ServiceVariant) => serviceVariant.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: true
});

export const reducer = createReducer(
  initialState,
  on(ServiceVariantServiceActions.loadServiceVariants, (state, {}) => {
    return { ...state, loading: true };
  }),
  on(ServiceVariantApiActions.loadServiceVariantsSuccess, (state, { serviceVariants }) => {
    state = { ...state, loading: false };
    return adapter.addMany(serviceVariants, adapter.removeAll(state));
  }),
  on(ServiceVariantApiActions.loadServiceVariantsError, (state, {}) => {
    return { ...state, loading: false };
  })
);
