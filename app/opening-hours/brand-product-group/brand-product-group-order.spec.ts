import { sortByBrandProductGroup } from './brand-product-group-order';

describe('sortByBrandProductGroup', () => {
  const mockBrandIds = ['MB', 'SMT', 'FUSO'];

  test('should sort by brand product group', () => {
    const mockData = [
      {
        brandId: 'MB',
        productGroupIds: ['PC'],
        openingHours: []
      },
      {
        brandId: 'MB',
        productGroupIds: ['BUS', 'VAN'],
        openingHours: []
      },
      {
        brandId: 'MB',
        productGroupIds: ['TRUCK'],
        openingHours: []
      },
      {
        brandId: 'MB',
        productGroupIds: ['UNIMOG'],
        openingHours: []
      }
    ];

    const expectData = [
      {
        brandId: 'MB',
        productGroupIds: ['PC'],
        openingHours: []
      },
      {
        brandId: 'MB',
        productGroupIds: ['VAN', 'BUS'],
        openingHours: []
      },
      {
        brandId: 'MB',
        productGroupIds: ['UNIMOG'],
        openingHours: []
      },
      {
        brandId: 'MB',
        productGroupIds: ['TRUCK'],
        openingHours: []
      }
    ];

    const result = sortByBrandProductGroup(mockData, mockBrandIds);
    expect(result).toEqual(expectData);
  });
});
