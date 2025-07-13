import { initialOutletProfileState, OutletProfileState } from '../reducers/outlet.reducers';
import { ProductCategory, Service } from '../../models/services.model';
import {
  selectPrimaryProductCategory,
  selectPrimaryProductCategoryServices,
  selectSecondaryProductCategories
} from './services.selectors';

describe('outlet services selector suite', () => {
  const productCategoryVehicle: ProductCategory = {
    name: 'Vehicle',
    translations: {
      'de-DE': 'translatedVehicle'
    }
  };
  const productCategoryAccessories: ProductCategory = {
    name: 'Accessories',
    translations: {
      'de-DE': 'translatedAccessories'
    }
  };

  describe('selectPrimaryProductCategory', () => {
    test('should return category with name Vehicle if existing', () => {
      const outletProfileState: OutletProfileState = {
        ...initialOutletProfileState,
        productCategories: [productCategoryVehicle, productCategoryAccessories]
      };

      const selection = selectPrimaryProductCategory.projector(outletProfileState);
      expect(selection).toStrictEqual(productCategoryVehicle);
    });

    test('should return undefined if category with name Vehicle not exists', () => {
      const outletProfileState: OutletProfileState = {
        ...initialOutletProfileState,
        productCategories: []
      };

      const selection = selectPrimaryProductCategory.projector(outletProfileState);
      expect(selection).toBe(undefined);
    });
  });

  describe('selectSecondaryProductCategories', () => {
    test('should return all category but the one with name Vehicle', () => {
      const outletProfileState: OutletProfileState = {
        ...initialOutletProfileState,
        productCategories: [productCategoryVehicle, productCategoryAccessories]
      };

      const selection = selectSecondaryProductCategories.projector(outletProfileState);
      expect(selection).toStrictEqual([productCategoryAccessories]);
    });

    test('should return empty array if only category with name Vehicle exists', () => {
      const outletProfileState: OutletProfileState = {
        ...initialOutletProfileState,
        productCategories: [productCategoryVehicle]
      };

      const selection = selectSecondaryProductCategories.projector(outletProfileState);
      expect(selection).toStrictEqual([]);
    });
  });

  describe('selectPrimaryProductCategoryServices', () => {
    const offeredServiceRepairMB: Service = {
      serviceId: 1,
      productCategoryId: '1',
      serviceName: 'serviceRepair',
      brandId: 'MB'
    };
    const offeredServiceRepairSMT: Service = {
      serviceId: 1,
      productCategoryId: '1',
      serviceName: 'serviceRepair',
      brandId: 'SMT'
    };

    test('should keep only the first service by id', () => {
      const outletProfileState: OutletProfileState = {
        ...initialOutletProfileState,
        services: [offeredServiceRepairMB, offeredServiceRepairSMT]
      };

      const selection = selectPrimaryProductCategoryServices.projector(outletProfileState);
      expect(selection).toStrictEqual([offeredServiceRepairMB]);
    });

    test('should return empty array if no service exists', () => {
      const outletProfileState: OutletProfileState = {
        ...initialOutletProfileState,
        services: []
      };

      const selection = selectPrimaryProductCategoryServices.projector(outletProfileState);
      expect(selection).toStrictEqual([]);
    });
  });
});
