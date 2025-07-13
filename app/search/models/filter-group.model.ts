export enum FilterGroup {
  ADDRESS,
  BRAND,
  MARKET_STRUCTURE,
  DISTRIBUTION_LEVEL,
  OUTLET,
  KEY,
  SERVICES,
  PRODUCT_GROUP,
  OTHERS
}

export class FilterGroupDefinitions {
  static get(filterGroup: FilterGroup): FilterGroupDefinition {
    return this.filterGroupDefinitions[filterGroup];
  }

  static getAll(): FilterGroupDefinition[] {
    return Object.keys(this.filterGroupDefinitions).map(key => this.filterGroupDefinitions[key]);
  }

  private static filterGroupDefinitions: { [key: number]: FilterGroupDefinition } = {
    [FilterGroup.ADDRESS]: {
      name: 'address',
      isSelectableFilter: true,
      filterOptions: [
        'street',
        'zipCode',
        'city',
        'district',
        'countryName',
        'province',
        'state',
        'addressAddition',
        'poBoxZipCode',
        'poBoxCity',
        'poBoxNumber'
      ],
      filterOptionsPrefix: ''
    },
    [FilterGroup.BRAND]: {
      name: 'brand',
      isSelectableFilter: false,
      filterOptions: [],
      filterOptionsPrefix: 'brands_'
    },
    [FilterGroup.MARKET_STRUCTURE]: {
      name: 'marketStructure',
      isSelectableFilter: false,
      filterOptions: ['mainOutlet', 'subOutlet', 'undefined'],
      filterOptionsPrefix: ''
    },
    [FilterGroup.DISTRIBUTION_LEVEL]: {
      name: 'distributionLevels',
      isSelectableFilter: false,
      filterOptions: [],
      filterOptionsPrefix: 'distributionLevels_'
    },
    [FilterGroup.OUTLET]: {
      name: 'outlet',
      isSelectableFilter: false,
      filterOptions: [
        'registeredOffice',
        'affiliate',
        'businessNames',
        'businessSiteId',
        'companyId',
        'legalName',
        'nameAddition',
        'active',
        'inactive',
        'activeOrInPlanning'
      ],
      filterOptionsPrefix: ''
    },
    [FilterGroup.KEY]: {
      name: 'key',
      isSelectableFilter: true,
      filterOptions: ['brandCodes', 'alias'],
      filterOptionsPrefix: ''
    },
    [FilterGroup.SERVICES]: {
      name: 'services',
      isSelectableFilter: false,
      filterOptions: ['offeredServices', 'offeredServiceCharacteristics'],
      filterOptionsPrefix: ''
    },
    [FilterGroup.PRODUCT_GROUP]: {
      name: 'productGroup',
      isSelectableFilter: false,
      filterOptions: [],
      filterOptionsPrefix: 'productGroups_'
    },
    [FilterGroup.OTHERS]: {
      name: 'others',
      isSelectableFilter: false,
      filterOptions: [],
      filterOptionsPrefix: ''
    }
  };
}

interface FilterGroupDefinition {
  name: string;
  isSelectableFilter: boolean;
  filterOptions: string[];
  filterOptionsPrefix: string;
}
