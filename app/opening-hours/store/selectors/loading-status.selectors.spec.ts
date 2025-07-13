import { Outlet, Service } from '../reducers';
import { initialState as initialOutletState } from '../reducers/outlet.reducers';
import { initialState as initialServiceState } from '../reducers/service.reducers';

import { selectInitializedState } from './loading-status.selectors';

describe('Opening hours loading status selectors Suite', () => {
  const outletId = 'GS1234567';
  const productCategoryId = '1';
  const serviceId = 2;

  describe('selectInitializedState', () => {
    const outletState: Outlet = { ...initialOutletState, businessSiteId: outletId };
    const serviceState: Service = {
      ...initialServiceState,
      productCategoryId: productCategoryId,
      serviceId: serviceId
    };
    const props: any = {
      outletId: outletId,
      productCategoryId: productCategoryId,
      serviceId: serviceId
    };

    test('returns true if data for given opening hours is already in store', () => {
      const selection = selectInitializedState.projector(outletState, serviceState, false, props);

      expect(selection).toBe(true);
    });

    test('returns true if data including service characteristic for given opening hours is already in store', () => {
      const serviceState_full: Service = { ...serviceState, serviceCharacteristicsId: '3' };
      const selection = selectInitializedState.projector(outletState, serviceState_full, false, {
        ...props,
        serviceCharacteristicsId: '3'
      });

      expect(selection).toBe(true);
    });

    test('returns false if loading status has an error', () => {
      const selection = selectInitializedState.projector(undefined, undefined, true, {});

      expect(selection).toBe(false);
    });

    test('returns false if outletId does not match', () => {
      const selection = selectInitializedState.projector(outletState, serviceState, false, {
        ...props,
        outletId: 'any_other'
      });

      expect(selection).toBe(false);
    });

    test('returns false if servcieId does not match', () => {
      const selection = selectInitializedState.projector(outletState, serviceState, false, {
        ...props,
        serviceId: 0
      });

      expect(selection).toBe(false);
    });

    test('returns false if productCategoryId does not match', () => {
      const selection = selectInitializedState.projector(outletState, serviceState, false, {
        ...props,
        productCategoryId: 'any_other'
      });

      expect(selection).toBe(false);
    });

    test('returns false if serviceCharacteristicsId does not match', () => {
      const selection = selectInitializedState.projector(
        outletState,
        { ...serviceState, serviceCharacteristicsId: '3' },
        false,
        {
          ...props,
          serviceCharacteristicsId: 'any_other'
        }
      );

      expect(selection).toBe(false);
    });
  });
});
