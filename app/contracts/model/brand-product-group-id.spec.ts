import { brandProductGroupIdMock } from './brand-product-group-id.mock';
import { BrandProductGroupId } from './brand-product-group-id.model';
import minusBrandProductGroupIds = BrandProductGroupId.minusBrandProductGroupIds;
import groupByBrandId = BrandProductGroupId.groupByBrandId;

describe('BrandProductGroupId', () => {
  describe('minusBrandProductGroupIds', () => {
    it('should filter by given params', () => {
      const brandProductGroupIds1 = brandProductGroupIdMock;
      const brandProductGroupIds2 = [brandProductGroupIdMock[0], brandProductGroupIdMock[2]];
      const result = brandProductGroupIds1.filter(minusBrandProductGroupIds(brandProductGroupIds2));

      expect(result).toEqual([brandProductGroupIdMock[1]]);
    });
  });

  describe('groupByBrandId', () => {
    it('should map contracts to product group IDs', () => {
      const brandProductGroupIds = brandProductGroupIdMock;
      const expected = {
        MB: [brandProductGroupIdMock[0], brandProductGroupIdMock[1]],
        SMT: [brandProductGroupIdMock[2]]
      };

      expect(groupByBrandId(brandProductGroupIds)).toEqual(expected);
    });
  });
});
