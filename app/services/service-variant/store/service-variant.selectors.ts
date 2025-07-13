import { createSelector } from '@ngrx/store';
import { BrandProductGroup } from 'app/services/brand-product-group/brand-product-group.model';
import { isEmpty as isObjEmpty, uniq } from 'ramda';

import { ServiceVariant } from '../service-variant.model';

import * as fromServiceVariant from './service-variant.reducer';
import { servicesState } from '../../store';

const selectServiceVariantEntitiesState = createSelector(
  servicesState.selectServicesState,
  state => state.serviceVariant
);

const { selectAll } = fromServiceVariant.adapter.getSelectors(selectServiceVariantEntitiesState);

const selectAllForServiceWith = (serviceId: number) =>
  createSelector(selectAll, (serviceVariants: ServiceVariant[]) =>
    serviceVariants.filter(serviceVariant => serviceVariant.serviceId === serviceId)
  );

const selectBy = (serviceId: number, brandId: string, productGroupId: string) =>
  createSelector(selectAll, (serviceVariants: ServiceVariant[]) =>
    serviceVariants.find(
      serviceVariant =>
        serviceVariant.serviceId === serviceId &&
        serviceVariant.brandId === brandId &&
        serviceVariant.productGroupId === productGroupId
    )
  );

const extractUniqueBrandProductGroups = createSelector(
  selectAll,
  (serviceVariants: ServiceVariant[]) =>
    uniq(
      serviceVariants
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
  selectServiceVariantEntitiesState,
  serviceVariantEntitiesState => serviceVariantEntitiesState.loading
);

const isEmpty = createSelector(selectAll, entities => isObjEmpty(entities));

export const serviceVariantSelectors = {
  selectAll,
  selectAllForServiceWith,
  selectBy,
  extractUniqueBrandProductGroups,
  isLoading,
  isEmpty
};
