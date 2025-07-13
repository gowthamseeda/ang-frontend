import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Service } from '../models/service.model';

import { ServiceApiActions, ServiceServiceActions } from './actions';

export interface State extends EntityState<Service> {
  loading: boolean;
  pageIndex: number;
}

export const adapter: EntityAdapter<Service> = createEntityAdapter<Service>({
  selectId: (service: Service) => service.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: true,
  pageIndex: 0
});

export const reducer = createReducer(
  initialState,
  on(ServiceServiceActions.loadServices, (state, {}) => {
    return { ...state, loading: true };
  }),
  on(ServiceApiActions.loadServicesSuccess, (state, { services }) => {
    state = { ...state, loading: false };
    return adapter.addMany(services, adapter.removeAll(state));
  }),
  on(ServiceApiActions.loadServicesError, (state, {}) => {
    return { ...state, loading: false };
  }),
  on(ServiceServiceActions.loadService, (state, {}) => {
    return { ...state, loading: true };
  }),
  on(ServiceApiActions.loadServiceSuccess, (state, { service }) => {
    state = { ...state, loading: false };
    return adapter.setOne(service, state);
  }),
  on(ServiceApiActions.loadServiceError, (state, {}) => {
    return { ...state, loading: false };
  }),
  on(ServiceServiceActions.setPageIndex, (state, { pageIndex }) => {
    return { ...state, pageIndex };
  })
);
