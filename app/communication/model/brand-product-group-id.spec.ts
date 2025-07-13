import { clone } from 'ramda';

import { brandProductGroupIdMock } from './brand-product-group-id.mock';
import { BrandProductGroupId } from './brand-product-group-id.model';
import minusBrandProductGroupIds = BrandProductGroupId.minusBrandProductGroupIds;
import groupByBrandId = BrandProductGroupId.groupByBrandId;
import compareWithBrandProductGroupId = BrandProductGroupId.compareWithBrandProductGroupId;
import compareWithBrandProductGroupIds = BrandProductGroupId.compareWithBrandProductGroupIds;

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
    it('should group brand product group IDs by brand ID', () => {
      const brandProductGroupIds = brandProductGroupIdMock;
      const expected = {
        MB: [brandProductGroupIdMock[0], brandProductGroupIdMock[1]],
        SMT: [brandProductGroupIdMock[2]]
      };

      expect(groupByBrandId(brandProductGroupIds)).toEqual(expected);
    });
  });

  describe('compareWithBrandProductGroupId', () => {
    it('should be true for an equal brand product group ID', () => {
      const brandProductGroupId = clone(brandProductGroupIdMock[0]);
      const brandProductGroupIdToCompare = clone(brandProductGroupIdMock[0]);

      expect(
        compareWithBrandProductGroupId(brandProductGroupIdToCompare)(brandProductGroupId)
      ).toBeTruthy();
    });

    it('should be false for an unequal brand product group ID', () => {
      const brandProductGroupId = clone(brandProductGroupIdMock[0]);
      const brandProductGroupIdToCompare = clone(brandProductGroupIdMock[1]);

      expect(
        compareWithBrandProductGroupId(brandProductGroupIdToCompare)(brandProductGroupId)
      ).toBeFalsy();
    });
  });

  describe('compareWithBrandProductGroupIds', () => {
    it('should be true for equal brand product group IDs', () => {
      const brandProductGroupIds = [
        clone(brandProductGroupIdMock[0]),
        clone(brandProductGroupIdMock[1])
      ];
      const brandProductGroupIdsToCompare = [
        clone(brandProductGroupIdMock[0]),
        clone(brandProductGroupIdMock[1])
      ];

      expect(
        compareWithBrandProductGroupIds(brandProductGroupIdsToCompare)(brandProductGroupIds)
      ).toBeTruthy();
    });

    it('should be false for unequal brand product group IDs', () => {
      const brandProductGroupIds = [
        clone(brandProductGroupIdMock[0]),
        clone(brandProductGroupIdMock[1])
      ];
      const brandProductGroupIdsToCompare = [
        clone(brandProductGroupIdMock[0]),
        clone(brandProductGroupIdMock[2])
      ];

      expect(
        compareWithBrandProductGroupIds(brandProductGroupIdsToCompare)(brandProductGroupIds)
      ).toBeFalsy();
    });
  });
});
