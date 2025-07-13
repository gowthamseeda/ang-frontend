import { createSelector } from '@ngrx/store';

import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { OpeningHoursState, selectOpeningHoursState } from '../reducers';

import { selectStandardOpeningHours } from './brand-product-group-opening-hours.selectors';

export const selectOpeningHoursPermissions = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => state.permissions
);

export const selectProductGroupRestrictions = createSelector(
  selectOpeningHoursPermissions,
  (openingHoursPermissions: OpeningHoursPermissions) =>
    openingHoursPermissions.productGroupRestrictions
);

export const selectBrandRestrictions = createSelector(
  selectOpeningHoursPermissions,
  (openingHoursPermissions: OpeningHoursPermissions) => openingHoursPermissions.brandRestrictions
);

export const selectIsCreateAndSaveAllowed = createSelector(
  selectBrandRestrictions,
  selectProductGroupRestrictions,
  selectStandardOpeningHours,
  (
    brandRestrictions: any,
    productGroupRestrictions: any,
    standardOpeningHours: any,
    props: any
  ) => {
    if (brandRestrictions.length === 0 && productGroupRestrictions.length === 0) {
      return props.updatePermission;
    }
    return (
      props.updatePermission &&
      standardOpeningHours
        .map((hours: any) => {
          return (
            (brandRestrictions.length === 0 || brandRestrictions.includes(hours.brandId)) &&
            (productGroupRestrictions.length === 0 ||
              hours.productGroupIds.some((element: any) =>
                productGroupRestrictions.includes(element)
              ))
          );
        })
        .includes(true)
    );
  }
);
