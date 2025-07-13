import { createSelector } from '@ngrx/store';

import { Service } from '../../models/services.model';
import { OutletProfileState } from '../reducers/outlet.reducers';

import { selectOutletProfileState } from './outlet-profile.selectors';

export const selectPrimaryProductCategory = createSelector(
  selectOutletProfileState,
  (outletProfileState: OutletProfileState) => {
    return outletProfileState.productCategories.find(
      productCategory => productCategory.name.toLocaleLowerCase() === 'vehicle'
    );
  }
);

export const selectSecondaryProductCategories = createSelector(
  selectOutletProfileState,
  (outletProfileState: OutletProfileState) => {
    return outletProfileState.productCategories.filter(
      productCategory => productCategory.name.toLocaleLowerCase() !== 'vehicle'
    );
  }
);

export const selectPrimaryProductCategoryServices = createSelector(
  selectOutletProfileState,
  (outletProfileState: OutletProfileState) => {
    const services: Service[] = [];
    return outletProfileState.services.reduce((aggregatedServices, currentService) => {
      if (
        aggregatedServices.find(srv => srv.serviceId === currentService.serviceId) === undefined
      ) {
        aggregatedServices.push(currentService);
      }
      return aggregatedServices;
    }, services);
  }
);
