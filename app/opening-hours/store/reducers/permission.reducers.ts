import { createReducer, on } from '@ngrx/store';

import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { brandProductGroupOpeningHoursLoadSuccess } from '../actions/brand-product-group-opening-hours.actions';

export const initialState: OpeningHoursPermissions = {
  productGroupRestrictions: [],
  brandRestrictions: []
};

export const reducer = createReducer(
  initialState,
  on(brandProductGroupOpeningHoursLoadSuccess, (stateBefore, { permissions }) => {
    return {
      ...stateBefore,
      ...permissions
    };
  })
);
