import { OfferedService } from './offered-service.model';

export const offeredServiceMock: OfferedService[] = [
  {
    id: 'GS00000001-1',
    brandId: 'MB',
    productGroupId: 'PC',
    productCategoryId: 1,
    serviceId: 120,
    validity: {
      application: true,
      valid: false
    }
  },
  {
    id: 'GS20000001-10',
    brandId: 'MB',
    productGroupId: 'PC',
    productCategoryId: 1,
    serviceId: 170
  },
  {
    id: 'GS20000001-10',
    brandId: 'MB',
    productGroupId: 'VAN',
    productCategoryId: 1,
    serviceId: 170
  },
  {
    id: 'GS20000001-1',
    brandId: 'MB',
    productGroupId: 'VAN',
    productCategoryId: 1,
    serviceId: 120,
    validity: {
      application: false,
      valid: true
    }
  }
];
