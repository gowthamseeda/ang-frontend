import { groupBy } from 'ramda';

export interface BrandProductGroupId {
  brandId: string;
  productGroupId: string;
}

export interface BrandProductGroupsGroupedByBrandId {
  [id: string]: BrandProductGroupId[];
}

export namespace BrandProductGroupId {
  export function minusBrandProductGroupIds(
    brandProductGroupIds: BrandProductGroupId[]
  ): (brandProductGroupId: BrandProductGroupId) => boolean {
    return (brandProductGroupId: BrandProductGroupId) =>
      !brandProductGroupIds.some(
        currentBrandProductGroupId =>
          brandProductGroupId.productGroupId === currentBrandProductGroupId.productGroupId &&
          brandProductGroupId.brandId === currentBrandProductGroupId.brandId
      );
  }

  export function groupByBrandId(
    brandProductGroupIds: BrandProductGroupId[]
  ): BrandProductGroupsGroupedByBrandId {
    return groupBy(brandProductGroup => brandProductGroup.brandId, brandProductGroupIds);
  }
}
