import {
  getMondayClosedMbVanStandardHour,
  getSundayClosedSmtPcStandardHour
} from '../../models/brand-product-group-opening-hours.mock';
import { StandardOpeningHour } from '../../models/opening-hour.model';

import { selectIsCreateAndSaveAllowed } from './permissions-selectors';

describe('OpeningHours Permissions Selectors Test Suite', () => {
  describe('selectIsCreateAllowed', () => {
    const hoursState: StandardOpeningHour[] = [
      getMondayClosedMbVanStandardHour(),
      getSundayClosedSmtPcStandardHour()
    ];
    const stateData_allAllowed = {
      isUpdateAllowed: true,
      brandRestrictions: [],
      productGroupRestrictions: [],
      standardHours: hoursState
    };

    test('should false if update is not allowed', () => {
      const state = { ...stateData_allAllowed };
      const selection = selectIsCreateAndSaveAllowed.projector(
        state.brandRestrictions,
        state.productGroupRestrictions,
        state.standardHours,
        {
          updatePermission: false
        }
      );
      expect(selection).toBe(false);
    });

    test('should false if brand restrictions do not match ', () => {
      const state = { ...stateData_allAllowed, brandRestrictions: ['MAY'] };
      const selection = selectIsCreateAndSaveAllowed.projector(
        state.brandRestrictions,
        state.productGroupRestrictions,
        state.standardHours,
        {
          updatePermission: true
        }
      );
      expect(selection).toBe(false);
    });

    test('should false if productGroup restrictions do not match ', () => {
      const state = { ...stateData_allAllowed, productGroupRestrictions: ['TRUCK'] };
      const selection = selectIsCreateAndSaveAllowed.projector(
        state.brandRestrictions,
        state.productGroupRestrictions,
        state.standardHours,
        {
          updatePermission: true
        }
      );
      expect(selection).toBe(false);
    });

    test('should true if update is allowed an no other restrictions', () => {
      const state = stateData_allAllowed;
      const selection = selectIsCreateAndSaveAllowed.projector(
        state.brandRestrictions,
        state.productGroupRestrictions,
        state.standardHours,
        {
          updatePermission: true
        }
      );
      expect(selection).toBe(true);
    });

    test('should true if update is allowed, no brand restriction but at least one matching productGroup restriction', () => {
      const state = { ...stateData_allAllowed, productGroupRestrictions: ['VAN', 'TRUCK'] };
      const selection = selectIsCreateAndSaveAllowed.projector(
        state.brandRestrictions,
        state.productGroupRestrictions,
        state.standardHours,
        {
          updatePermission: true
        }
      );
      expect(selection).toBe(true);
    });

    test('should true if update is allowed, no productGroup restriction but at least one matching brand restriction', () => {
      const state = { ...stateData_allAllowed, brandRestrictions: ['MB', 'MAY'] };
      const selection = selectIsCreateAndSaveAllowed.projector(
        state.brandRestrictions,
        state.productGroupRestrictions,
        state.standardHours,
        {
          updatePermission: true
        }
      );
      expect(selection).toBe(true);
    });
  });
});
