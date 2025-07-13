import { FilterGroup, FilterGroupDefinitions } from './filter-group.model';
import { FilterType } from './filter-type.model';

export class FilterOption {
  value: string;
  matchCount?: number | undefined;
  group?: FilterGroup;

  constructor(filterOption: FilterOption) {
    this.value = filterOption.value;
    this.group = filterOption.group;
    this.matchCount = filterOption.matchCount;
  }

  static sortByMatchCountDesc(filterOptions: any[]): any[] {
    return filterOptions.sort((a, b) => {
      a.matchCount = a.matchCount || 0;
      b.matchCount = b.matchCount || 0;

      if (a.matchCount > b.matchCount) {
        return -1;
      } else if (a.matchCount < b.matchCount) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // temporarily groups will be set / distinguished by frontend
  // but in future should be delivered by backend
  static setGroupOf(filterOptions: TypedFilterOption[]): void {
    filterOptions.forEach(filterOption => {
      if (this.isAddress(filterOption)) {
        filterOption.group = FilterGroup.ADDRESS;
      } else if (this.isBrand(filterOption)) {
        filterOption.group = FilterGroup.BRAND;
      } else if (this.isDistributionLevel(filterOption)) {
        filterOption.group = FilterGroup.DISTRIBUTION_LEVEL;
      } else if (this.isKey(filterOption)) {
        filterOption.group = FilterGroup.KEY;
      } else if (this.isOutlet(filterOption)) {
        filterOption.group = FilterGroup.OUTLET;
      } else if (this.isMarketStructure(filterOption)) {
        filterOption.group = FilterGroup.MARKET_STRUCTURE;
      } else if (this.isOfferedService(filterOption)) {
        filterOption.group = FilterGroup.SERVICES;
      } else if (this.isProductGroup(filterOption)) {
        filterOption.group = FilterGroup.PRODUCT_GROUP;
      } else {
        filterOption.group = FilterGroup.OTHERS;
      }
    });
  }

  static isBrand(filterOption: FilterOption): boolean {
    return filterOption.value.includes(
      FilterGroupDefinitions.get(FilterGroup.BRAND).filterOptionsPrefix
    );
  }

  private static isAddress(filterOption: FilterOption): boolean {
    return FilterGroupDefinitions.get(FilterGroup.ADDRESS).filterOptions.includes(
      filterOption.value
    );
  }

  private static isDistributionLevel(filterOption: FilterOption): boolean {
    return filterOption.value.includes(
      FilterGroupDefinitions.get(FilterGroup.DISTRIBUTION_LEVEL).filterOptionsPrefix
    );
  }

  private static isKey(filterOption: FilterOption): boolean {
    return FilterGroupDefinitions.get(FilterGroup.KEY).filterOptions.includes(filterOption.value);
  }

  private static isOutlet(filterOption: FilterOption): boolean {
    return FilterGroupDefinitions.get(FilterGroup.OUTLET).filterOptions.includes(
      filterOption.value
    );
  }

  private static isMarketStructure(filterOption: FilterOption): boolean {
    return FilterGroupDefinitions.get(FilterGroup.MARKET_STRUCTURE).filterOptions.includes(
      filterOption.value
    );
  }

  private static isOfferedService(filterOption: FilterOption): boolean {
    return FilterGroupDefinitions.get(FilterGroup.SERVICES).filterOptions.includes(
      filterOption.value
    );
  }

  static isProductGroup(filterOption: FilterOption): boolean {
    return filterOption.value.includes(
      FilterGroupDefinitions.get(FilterGroup.PRODUCT_GROUP).filterOptionsPrefix
    );
  }
}

export class TypedFilterOption extends FilterOption {
  type: FilterType;
  group: FilterGroup;

  constructor(searchFilterOption: FilterOption, type: FilterType) {
    super(searchFilterOption);
    this.type = type;
  }
}
