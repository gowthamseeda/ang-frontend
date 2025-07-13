import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { OfferedService } from '../../offered-service.model';

import { OfferedServiceApiActions, OfferedServiceServiceActions } from '../actions';

export interface State extends EntityState<OfferedService> {
  loading?: boolean;
}

export const adapter: EntityAdapter<OfferedService> = createEntityAdapter<OfferedService>({
  selectId: (offeredService: OfferedService) => offeredService.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({ loading: true });

export const reducer = createReducer(
  initialState,
  on(OfferedServiceServiceActions.loadOfferedServices, state => {
    return { ...state, loading: true };
  }),
  on(OfferedServiceApiActions.loadOfferedServicesSuccess, (state, { offeredServices }) => {
    return adapter.setAll(offeredServices, { ...state, loading: false });
  }),
  on(OfferedServiceApiActions.loadOfferedServicesError, state =>
    adapter.removeAll({ ...state, loading: false })
  ),
  on(OfferedServiceServiceActions.resetOfferedServices, state => adapter.removeAll(state)),
  on(OfferedServiceServiceActions.addOfferedService, (state, { offeredService }) =>
    adapter.addOne(offeredService, state)
  ),
  on(OfferedServiceServiceActions.removeOfferedService, (state, { id }) =>
    adapter.removeOne(id, state)
  ),
  on(OfferedServiceServiceActions.toggleOnlineOnly, (state, { id, onlineOnly }) => {
    const offeredServiceToBeUpdated: Update<OfferedService> = { id, changes: { onlineOnly } };
    return adapter.updateOne(offeredServiceToBeUpdated, state);
  }),
  on(OfferedServiceServiceActions.updateModelSeriesIds, (state, { id, modelSeriesIds }) => {
    const offeredServiceToBeUpdated: Update<OfferedService> = { id, changes: { modelSeriesIds } };
    return adapter.updateOne(offeredServiceToBeUpdated, state);
  }),
  on(OfferedServiceServiceActions.updateSeriesIds, (state, { id, seriesIds }) => {
    const offeredServiceToBeUpdated: Update<OfferedService> = { id, changes: { seriesIds } };
    return adapter.updateOne(offeredServiceToBeUpdated, state);
  }),
  on(
    OfferedServiceServiceActions.updateApplicationValidity,
    OfferedServiceServiceActions.updateApplicationUntilValidity,
    OfferedServiceServiceActions.updateValidFromValidity,
    OfferedServiceServiceActions.updateValidUntilValidity,
    (state, { ids, type, ...validity }) => {
      const offeredServices: OfferedService[] = Object.values(state.entities).map(
        it => it as OfferedService
      );

      const entityIds: string[] = ids.map(id => {
        const offeredService = offeredServices.filter(os => os.id === id);
        return offeredService[0].id;
      });

      const offeredServicesToBeUpdated: Update<OfferedService>[] = entityIds.map(id => {
        const validityChange = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...state.entities[id]!!['validity'],
          ...validity
        };

        return {
          id,
          changes: { validity: validityChange }
        };
      });
      return adapter.updateMany(offeredServicesToBeUpdated, state);
    }
  ),
  on(OfferedServiceServiceActions.updateValidity, (state, { validityChange }) => {
    const { ids, validity = {} } = validityChange;

    const offeredServices: OfferedService[] = Object.values(state.entities).map(
      it => it as OfferedService
    );

    const entityIds: string[] = ids.map(id => {
      const offeredService = offeredServices.filter(os => os.id === id);
      return offeredService[0].id;
    });

    const offeredServicesToBeUpdated: Update<OfferedService>[] = entityIds.map(id => {
      if (Object.keys(validity).length > 0) {
        return {
          id,
          changes: { validity: { ...validity } }
        };
      }

      return {
        id,
        changes: { validity: undefined }
      };
    });

    return adapter.updateMany(offeredServicesToBeUpdated, state);
  })
);
