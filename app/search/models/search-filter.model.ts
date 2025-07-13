import { FilterGroupDefinitions } from './filter-group.model';
import { FilterType } from './filter-type.model';

export class SearchFilter {
  type: FilterType;
  name?: string;
  value?: string;

  constructor(type: FilterType, name?: string, value?: string) {
    this.type = type;
    this.name = name;
    this.value = value;
  }

  static splitSearchFilterGroups(searchFilters: SearchFilter[]): SearchFilter[] {
    FilterGroupDefinitions.getAll()
      .filter(filterGroup => filterGroup.isSelectableFilter)
      .forEach(filterGroup => {
        const foundSearchFilterGroup = searchFilters.find(
          searchFilter => searchFilter.name === filterGroup.name
        );

        if (foundSearchFilterGroup) {
          const searchFiltersWithoutSearchFilterGroup = searchFilters.filter(
            searchFilter => searchFilter.name !== filterGroup.name
          );
          const searchFilterGroupSplitted = new SearchFilter(
            FilterType.TAG,
            filterGroup.filterOptions.filter(Boolean).join('||'),
            foundSearchFilterGroup.value
          );

          searchFilters = [...searchFiltersWithoutSearchFilterGroup, searchFilterGroupSplitted];
        }
      });

    return searchFilters;
  }
}

export class SearchFilterTag extends SearchFilter {
  exactMatch = false;

  constructor(value: string, name?: string) {
    super(FilterType.TAG, name, value);
  }

  matchExact(exactMatch: boolean): SearchFilterTag {
    this.exactMatch = exactMatch;
    return this;
  }
}

export class SearchFilterFlag extends SearchFilter {
  constructor(name: string) {
    super(FilterType.FLAG, name);
  }

  static getFilterFlag(searchFilter: SearchFilterFlag) {
    if (this.isBrand(searchFilter)) {
      return 'brand';
    } else if (this.isProductGroup(searchFilter)) {
      return 'productGroup';
    } else {
      return 'other';
    }
  }

  static isBrand(searchFilter: SearchFilterFlag): boolean {
    return searchFilter.name !== undefined && searchFilter.name.includes('brands_');
  }

  static isProductGroup(searchFilter: SearchFilterFlag): boolean {
    return searchFilter.name !== undefined && searchFilter.name.includes('productGroups_');
  }
}
