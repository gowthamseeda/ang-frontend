import { BrandProductGroup, brandProductGroupUtils } from './brand-product-group.model';

describe('Brand Product Group', () => {
  describe('groupByBrandId()', () => {
    it('should group brandProductGroups by their brandId', () => {
      const brandProductGroups: BrandProductGroup[] = [
        { brandId: 'MB', productGroupId: 'PC' },
        { brandId: 'MB', productGroupId: 'VAN' },
        { brandId: 'SMT', productGroupId: 'PC' }
      ];
      const result = brandProductGroupUtils.groupByBrandId(brandProductGroups);
      expect(result).toEqual({
        MB: [
          { brandId: 'MB', productGroupId: 'PC' },
          { brandId: 'MB', productGroupId: 'VAN' }
        ],
        SMT: [{ brandId: 'SMT', productGroupId: 'PC' }]
      });
    });
  });

  describe('orderBy()', () => {
    it('should order brandProductGroups accordingly', () => {
      const brandProductGroups: BrandProductGroup[] = [
        { brandId: 'MB', productGroupId: 'VAN' },
        { brandId: 'MB', productGroupId: 'PC' },
        { brandId: 'MB', productGroupId: 'TRUCK' },
        { brandId: 'MB', productGroupId: 'UNIMOG' },
        { brandId: 'MB', productGroupId: 'BUS' }
      ];
      const result = brandProductGroupUtils.orderByProductGroupId(brandProductGroups);
      expect(result).toEqual([
        { brandId: 'MB', productGroupId: 'PC' },
        { brandId: 'MB', productGroupId: 'VAN' },
        { brandId: 'MB', productGroupId: 'UNIMOG' },
        { brandId: 'MB', productGroupId: 'BUS' },
        { brandId: 'MB', productGroupId: 'TRUCK' }
      ]);
    });
  });
});
