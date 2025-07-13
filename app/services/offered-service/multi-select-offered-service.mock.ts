import { MultiSelectOfferedService } from '../service/models/multi-select.model';
import { Mock } from '../../testing/test-utils/mock';

export class MultiSelectOfferedServiceMock extends Mock {
  static mock: { [key: string]: MultiSelectOfferedService } = {
    'GS0000001-1': {
      id: 'GS0000001-1',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      validity: undefined
    },
    'GS0000001-2': {
      id: 'GS0000001-2',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MYB',
      productGroupId: 'PC',
      validity: undefined
    },
    'GS0000001-3': {
      id: 'GS0000001-3',
      serviceId: 2,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'PC',
      validity: {
        application: true,
        applicationValidUntil: '2019-01-01',
        validFrom: '2019-01-02',
        validUntil: '2019-01-31',
        valid: true
      }
    },
    'GS0000001-4': {
      id: 'GS0000001-4',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      validity: undefined
    },
    'GS0000001-5': {
      id: 'GS0000001-5',
      serviceId: 3,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'VAN',
      validity: {
        application: true,
        applicationValidUntil: '2019-01-01',
        validFrom: '2019-01-02',
        validUntil: '2019-01-31',
        valid: true
      }
    }
  };
}
