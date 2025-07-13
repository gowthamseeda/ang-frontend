import { PRODUCT_GROUP_ORDER } from '../../services/brand-product-group/brand-product-group.model';
import { sortByReference } from '../../shared/util/arrays';
import { StandardOpeningHour } from '../models/opening-hour.model';

const sortByBrandIds = (hours: StandardOpeningHour[], sortedBrands: string[]) =>
  sortByReference<StandardOpeningHour, string>(
    hours,
    sortedBrands,
    (hour: StandardOpeningHour) => hour.brandId
  );

const sortByProductGroupIds = (ids: string[]) =>
  sortByReference<string, string>(ids, PRODUCT_GROUP_ORDER, (elem: string) => elem);

const sortByBrandIdsProductGroupIds = (hours: StandardOpeningHour[], sortedBrands: string[]) =>
  sortByReference<StandardOpeningHour, string>(
    hours,
    brandProductGroupPriority(sortedBrands),
    (hour: StandardOpeningHour) => hour.brandId + hour.productGroupIds[0]
  );

export const sortByBrandProductGroup = (
  hours: StandardOpeningHour[],
  sortedBrands: string[]
): StandardOpeningHour[] => {
  return sortByBrandIdsProductGroupIds(
    sortByBrandIds(hours, sortedBrands).map((hour: StandardOpeningHour) => ({
      ...hour,
      productGroupIds: sortByProductGroupIds(hour.productGroupIds)
    })),
    sortedBrands
  );
};

export const sort = (
  hours: StandardOpeningHour[],
  sortedBrands: string[]
): StandardOpeningHour[] => {
  return sortByBrandIds(hours, sortedBrands).map((hour: StandardOpeningHour) => ({
    ...hour,
    productGroupIds: sortByProductGroupIds(hour.productGroupIds)
  }));
};

function brandProductGroupPriority(sortedBrands: string[]): string[] {
  const brandProductGroupPriorities: string[] = [];
  sortedBrands.forEach(brand => {
    PRODUCT_GROUP_ORDER.forEach(productGroup => {
      brandProductGroupPriorities.push(brand + productGroup);
    });
  });
  return brandProductGroupPriorities;
}
