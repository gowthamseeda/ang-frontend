import { createSelector } from '@ngrx/store';
import { isEmpty as isObjEmpty } from 'ramda';

import { OfferedService } from '../../offered-service.model';

import { offeredServiceSelectors } from './offered-service.selectors';

const isEmpty = createSelector(offeredServiceSelectors.selectEntities, entities =>
  isObjEmpty(entities)
);

const isAtLeastOneOfferedForServiceWith = (serviceId: number) =>
  createSelector(offeredServiceSelectors.selectAll, (offeredServices: OfferedService[]) =>
    offeredServices.some(offeredService => offeredService.serviceId === serviceId)
  );

const isOfferedServiceValidityMaintainedForServiceWith = (serviceId: number) =>
  createSelector(offeredServiceSelectors.selectAll, (offeredServices: OfferedService[]) =>
    offeredServices
      .filter(offeredService => offeredService.serviceId === serviceId)
      .every(offeredService => !!offeredService.validity)
  );

const isOfferedServiceOpeningHoursMaintainedForServiceWith = (serviceId: number) =>
  createSelector(offeredServiceSelectors.selectAll, (offeredServices: OfferedService[]) =>
    offeredServices
      .filter(offeredService => offeredService.serviceId === serviceId)
      .every(offeredService => !!offeredService.openingHours)
  );

const isOfferedServiceContractsMaintainedForServiceWith = (serviceId: number) =>
  createSelector(offeredServiceSelectors.selectAll, (offeredServices: OfferedService[]) =>
    offeredServices
      .filter(offeredService => offeredService.serviceId === serviceId)
      .every(offeredService => !!offeredService.contracts)
  );

const isOfferedServiceCommunicationsMaintainedForServiceWith = (serviceId: number) =>
  createSelector(offeredServiceSelectors.selectAll, (offeredServices: OfferedService[]) =>
    offeredServices
      .filter(offeredService => offeredService.serviceId === serviceId)
      .every(offeredService => !!offeredService.communications)
  );

export const offeredServiceValidationSelectors = {
  isEmpty,
  isAtLeastOneOfferedForServiceWith,
  isOfferedServiceValidityMaintainedForServiceWith,
  isOfferedServiceOpeningHoursMaintainedForServiceWith,
  isOfferedServiceContractsMaintainedForServiceWith,
  isOfferedServiceCommunicationsMaintainedForServiceWith
};
