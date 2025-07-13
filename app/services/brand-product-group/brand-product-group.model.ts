import { groupBy } from 'ramda';
import { sortByReference } from '../../shared/util/arrays';

export const PRODUCT_GROUP_ORDER = ['PC', 'VAN', 'UNIMOG', 'BUS', 'TRUCK'];

export interface BrandProductGroup {
  brandId: string;
  productGroupId: string;
}

export interface BrandProductGroupsGroupedByBrandId {
  [id: string]: BrandProductGroup[];
}

const groupByBrandId = (
  brandProductGroups: BrandProductGroup[]
): BrandProductGroupsGroupedByBrandId =>
  groupBy(brandProductGroup => brandProductGroup.brandId, brandProductGroups);

const orderByProductGroupId = (brandProductGroups: BrandProductGroup[]): BrandProductGroup[] =>
  sortByReference<BrandProductGroup, string>(
    brandProductGroups,
    PRODUCT_GROUP_ORDER,
    (elem: BrandProductGroup) => elem.productGroupId
  );

export const brandProductGroupUtils = {
  groupByBrandId,
  orderByProductGroupId
};
