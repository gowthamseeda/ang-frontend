import { createSelector } from '@ngrx/store';
import { eqBy, prop, unionWith } from 'ramda';

import { offeredServiceSelectors } from '../../offered-service/store/selectors/offered-service.selectors';
import { serviceVariantSelectors } from '../../service-variant/store/service-variant.selectors';
import { Service } from '../models/service.model';

import * as fromServiceReducer from './service.reducer';
import { OfferedService } from '../../offered-service/offered-service.model';
import { servicesState } from '../../store';
import { ServiceVariant } from '../../service-variant/service-variant.model';

const selectServiceEntitiesState = createSelector(
  servicesState.selectServicesState,
  state => state.service
);

const { selectAll, selectEntities } = fromServiceReducer.adapter.getSelectors(
  selectServiceEntitiesState
);

const selectBy = (serviceId: number) =>
  createSelector(selectEntities, entities => entities[serviceId]);

const selectAllBy = (serviceIds: number[]) =>
  createSelector(selectAll, (services: Service[]) =>
    services.filter(service => serviceIds.includes(service.id))
  );

const selectAllWithOfferedServices = createSelector(
  selectAll,
  offeredServiceSelectors.selectAll,
  (services: Service[], offeredServices: OfferedService[]) =>
    services
      .filter(service =>
        offeredServices.some(offeredService => offeredService.serviceId === service.id)
      )
      .map(service => {
        const offeredService = offeredServices.find(os => os.serviceId === service.id);
        return {
          ...service,
          productCategoryId: offeredService?.productCategoryId,
          serviceId: offeredService?.serviceId
        };
      })
);

const selectAllWithServiceVariants = createSelector(
  selectAll,
  serviceVariantSelectors.selectAll,
  (services: Service[], serviceVariants: ServiceVariant[]) =>
    services.filter(({ id }) => serviceVariants.some(({ serviceId }) => id === serviceId))
);

const selectValidServices = createSelector(
  selectAllWithServiceVariants,
  selectAllWithOfferedServices,
  combineServices
);

const selectOfferedServices = createSelector(selectAllWithOfferedServices, combineServices);

function combineServices(...args: any): Service[] {
  const union = (s1: Service[], s2: Service[]): Service[] => unionWith(eqBy(prop('id')), s1, s2);
  let combined: Service[] = [];
  args.forEach((arg: any) => {
    combined = union(combined, arg);
  });
  return combined;
}

const isServiceIsActive = (serviceId: number) =>
  createSelector(selectBy(serviceId), service => service?.active ?? false);

const isLoading = createSelector(
  selectServiceEntitiesState,
  serviceEntitiesState => serviceEntitiesState.loading
);

const selectPageIndex = createSelector(
  selectServiceEntitiesState,
  serviceEntitiesState => serviceEntitiesState.pageIndex
);

export const serviceSelectors = {
  selectAll,
  selectEntities,
  selectBy,
  selectAllBy,
  isServiceIsActive,
  selectValidServices,
  selectOfferedServices,
  isLoading,
  selectPageIndex
};
