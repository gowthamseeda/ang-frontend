import { MasterServiceVariant } from './master-service-variant.model';
import { Mock } from '../../../../testing/test-utils/mock';

export class MasterServiceVariantMock extends Mock {
  static mock: { [id: string]: MasterServiceVariant } = {
    1: {
      id: 1,
      serviceId: 120,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      onlineOnlyAllowed: true,
      nonCustomerFacingAllowed: true,
      active: true
    },
    2: {
      id: 2,
      serviceId: 120,
      serviceCharacteristicId: 195,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      onlineOnlyAllowed: true,
      active: true
    },
    3: {
      id: 3,
      serviceId: 170,
      serviceCharacteristicId: 180,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      onlineOnlyAllowed: true,
      active: true
    },
    4: {
      id: 4,
      serviceId: 120,
      serviceCharacteristicId: 196,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1, 2],
      allowedModelSeriesIds: ['W247', 'C205'],
      onlineOnlyAllowed: false,
      active: true
    },
    5: {
      id: 5,
      serviceId: 120,
      serviceCharacteristicId: 195,
      productCategoryId: 1,
      brandId: 'MYB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      onlineOnlyAllowed: true,
      active: true
    },
    6: {
      id: 6,
      serviceId: 120,
      productCategoryId: 2,
      brandId: 'MYB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      countryRestrictions: ['DE', 'CH'],
      active: true
    },
    7: {
      id: 7,
      serviceId: 120,
      serviceCharacteristicId: 195,
      productCategoryId: 2,
      brandId: 'MYB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      countryRestrictions: ['DE', 'CH'],
      active: true
    },
    8: {
      id: 8,
      serviceId: 120,
      serviceCharacteristicId: 195,
      productCategoryId: 2,
      brandId: 'FUSO',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      countryRestrictions: ['DE', 'CH'],
      active: false
    },
    9: {
      id: 9,
      serviceId: 1,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247', 'C205'],
      allowedCatalogIds: [1],
      active: true
    },
    10: {
      id: 10,
      serviceId: 170,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      active: true
    },
    11: {
      id: 11,
      serviceId: 200,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      active: true
    },
    12: {
      id: 12,
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      active: true
    },
    13: {
      id: 13,
      serviceId: 120,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      allowedCatalogIds: [1],
      excludedServiceVariantIds: [1, 2],
      active: true
    }
  };
}
