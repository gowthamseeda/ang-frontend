import { createReducer, on } from '@ngrx/store';

import { brandProductGroupOpeningHoursLoadSuccess } from '../actions/brand-product-group-opening-hours.actions';

import { Service } from './index';

export const initialState: Service = {
  serviceId: 0,
  productCategoryId: '',
  serviceCharacteristicsId: '',
  serviceName: '',
  serviceCharacteristicName: '',
  translations: {},
  name: ''
};

export const reducer = createReducer(
  initialState,
  on(brandProductGroupOpeningHoursLoadSuccess, (stateBefore, { service }) => ({
    ...stateBefore,
    ...service
  }))
);
