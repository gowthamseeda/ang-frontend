import { createReducer, on } from '@ngrx/store';

import { brandProductGroupOpeningHoursLoadSuccess } from '../actions/brand-product-group-opening-hours.actions';

import { Outlet } from './index';

export const initialState: Outlet = {
  businessSiteId: '',
  countryId: ''
};

export const reducer = createReducer(
  initialState,
  on(brandProductGroupOpeningHoursLoadSuccess, (stateBefore, { outlet }) => ({
    ...stateBefore,
    businessSiteId: outlet.businessSiteId,
    countryId: outlet.countryId
  }))
);
