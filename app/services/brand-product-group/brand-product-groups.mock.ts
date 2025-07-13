import { BrandProductGroup } from './brand-product-group.model';

export function getBrandProductGroupIdsInFirstRowMock(): BrandProductGroup[] {
  return [
    { brandId: 'MB', productGroupId: 'PC' },
    { brandId: 'MB', productGroupId: 'VAN' }
  ];
}

export function getBrandProductGroupIdsInSecondRowMock(): BrandProductGroup[] {
  return [{ brandId: 'SMT', productGroupId: 'PC' }];
}

export function getBrandProductGroupsDataMock(): any {
  return [
    {
      data: 'mock',
      brandProductGroupIds: getBrandProductGroupIdsInFirstRowMock()
    },
    {
      data: undefined,
      brandProductGroupIds: getBrandProductGroupIdsInSecondRowMock()
    }
  ];
}
