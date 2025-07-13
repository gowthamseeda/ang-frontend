import { createSelector } from '@ngrx/store';
import { uniq } from 'ramda';

import { BrandProductGroup } from '../../../brand-product-group/brand-product-group.model';
import { servicesState } from '../../../store';
import { OfferedService } from '../../offered-service.model';
import * as fromOfferedService from '../reducers/offered-service.reducer';

const selectOfferedServiceState = createSelector(
  servicesState.selectServicesState,
  state => state.offeredService
);

const { selectAll: selectAllFromEntitiesSelector, selectEntities } =
  fromOfferedService.adapter.getSelectors(selectOfferedServiceState);

const selectAll = createSelector(
  selectAllFromEntitiesSelector,
  (offeredServices: OfferedService[]) => offeredServices
);

const selectById = (offeredServiceId: string) =>
  createSelector(selectEntities, entities => entities[offeredServiceId]);

const selectMatchingId = (serviceId: number, brandId: string, productGroupId: string) =>
  createSelector(selectAll, (offeredServices: OfferedService[]) => {
    const matchingOfferedService = offeredServices.find(
      offeredService =>
        offeredService.serviceId === serviceId &&
        offeredService.brandId === brandId &&
        offeredService.productGroupId === productGroupId
    );

    return matchingOfferedService?.id;
  });

const selectAllForServiceWith = (serviceId: number) =>
  createSelector(selectAll, (offeredServices: OfferedService[]) =>
    offeredServices.filter(offeredService => offeredService.serviceId === serviceId)
  );

const extractOfferedServiceUniqueBrandProductGroups = createSelector(
  selectAll,
  (offeredService: OfferedService[]) =>
    uniq(
      offeredService
        .filter(({ brandId, productGroupId }) => !!brandId && !!productGroupId)
        .map(
          ({ brandId, productGroupId }) =>
            ({
              brandId,
              productGroupId
            } as BrandProductGroup)
        )
    )
);

const isLoading = createSelector(
  selectOfferedServiceState,
  serviceEntitiesState => !!serviceEntitiesState.loading
);

const selectSisterOutlets = createSelector(
  servicesState.selectServicesState,
  state => state.sisterOutlets.sisterOutlets,
);

const selectSisterOutletState = createSelector(
  servicesState.selectServicesState,
  state => state.sisterOutlets
);

export const selectCompanySisterOutletsFullResponse = createSelector(
  selectSisterOutletState,
  (state: any) => ({
    sisterOutlets: state.sisterOutlets,
    offeredServices: state.offeredServices
  })
);

export const offeredServiceSelectors = {
  isLoading,
  selectOfferedServiceState,
  selectAll,
  extractOfferedServiceUniqueBrandProductGroups,
  selectEntities,
  selectAllForServiceWith,
  selectById,
  selectMatchingId,
  selectSisterOutlets,
  selectCompanySisterOutletsFullResponse
};
