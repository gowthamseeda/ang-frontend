import { clone } from 'ramda';
import { ServiceVariant } from './service-variant.model';
import { Mock } from '../../testing/test-utils/mock';

export class ServiceVariantMock extends Mock {
  static mock: { [key: string]: ServiceVariant } = {
    '1': {
      id: 1,
      serviceId: 120,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      allowedSeriesIds: [1],
      allowedModelSeriesIds: ['W247'],
      onlineOnlyAllowed: true,
      nonCustomerFacingAllowed: true
    },
    '2': {
      id: 2,
      serviceId: 120,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      onlineOnlyAllowed: true,
      allowedModelSeriesIds: ['W247'],
      allowedSeriesIds: [1],
      serviceCharacteristicId: 195
    },
    '3': {
      id: 3,
      serviceId: 170,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      onlineOnlyAllowed: true,
      allowedModelSeriesIds: ['W247'],
      allowedSeriesIds: [1],
      serviceCharacteristicId: 180
    },
    '4': {
      id: 4,
      serviceId: 120,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      onlineOnlyAllowed: false,
      allowedModelSeriesIds: ['W247', 'C205'],
      allowedSeriesIds: [1, 2],
      serviceCharacteristicId: 196
    },
    '5': {
      id: 5,
      serviceId: 3,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'VAN',
      onlineOnlyAllowed: false,
      active: true
    },
    '6': {
      id: 6,
      serviceId: 3,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'VAN',
      onlineOnlyAllowed: false,
      active: false
    }
  };

  static asIds(): number[] {
    return clone(Object.keys(this.mock).map(key => this.mock[key].id));
  }

  static forContracts(): ServiceVariant[] {
    return clone([this.mock[1], this.mock[2], this.mock[3], this.mock[4]]);
  }
}
