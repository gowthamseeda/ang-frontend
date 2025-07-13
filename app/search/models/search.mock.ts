import { FilterGroup } from './filter-group.model';
import { FilterOption, TypedFilterOption } from './filter-option.model';
import { FilterType } from './filter-type.model';
import { SearchFilter, SearchFilterFlag, SearchFilterTag } from './search-filter.model';
import { SearchItem } from './search-item.model';

export function getAutoLangSearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000001',
    type: 'BusinessSite',
    payload: {
      id: 'GS00000001',
      legalName: '***Auto*** ***Lang*** AG',
      zipCode: '8280',
      city: 'Kreuzlingen',
      street: 'Sonnenwiesenstraße',
      streetNumber: '17',
      countryId: 'CH',
      countryName: 'Switzerland',
      registeredOffice: true
    }
  };
}

export function getAutoGermaniaItemMock(): SearchItem<any> {
  return {
    id: 'GS00105332',
    type: 'BusinessSite',
    payload: {
      id: 'GS00105332',
      legalName: 'PT. Mas ***Auto*** ***Germania***',
      zipCode: '42438',
      city: 'Cilegon',
      street: 'Banten',
      streetNumber: '1018',
      countryId: 'ID',
      countryName: 'Indonesia',
      registeredOffice: false
    }
  };
}

export function getAutoFrickerGS3SearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000003',
    type: 'BusinessSite',
    payload: {
      active: false,
      id: 'GS00000003',
      legalName: 'Auto Fricker',
      zipCode: '89077',
      city: 'Ulm',
      street: 'Obere Bleiche',
      streetNumber: '2',
      countryId: 'DE',
      countryName: 'Deutschland'
    }
  };
}

export function getAutoFrickerGS4SearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000004',
    type: 'BusinessSite',
    payload: {
      active: true,
      id: 'GS00000004',
      legalName: 'Auto Fricker',
      zipCode: '89077',
      city: 'Ulm',
      street: 'Obere Bleiche',
      streetNumber: '2',
      countryId: 'DE',
      countryName: 'Deutschland'
    }
  };
}

export function getMainBusinessSiteSearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000004',
    type: 'BusinessSite',
    payload: {
      id: 'GS00000004',
      legalName: 'Auto Fricker',
      zipCode: '89077',
      city: 'Ulm',
      street: 'Obere Bleiche',
      streetNumber: '2',
      countryId: 'DE',
      countryName: 'Deutschland',
      mainOutlet: true,
      subOutlet: false
    }
  };
}

export function getSubBusinessSiteSearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000004',
    type: 'BusinessSite',
    payload: {
      id: 'GS00000004',
      legalName: 'Auto Fricker',
      zipCode: '89077',
      city: 'Ulm',
      street: 'Obere Bleiche',
      streetNumber: '2',
      countryId: 'DE',
      countryName: 'Deutschland',
      mainOutlet: false,
      subOutlet: true
    }
  };
}

export function getAffiliateSearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000005',
    type: 'BusinessSite',
    payload: {
      id: 'GS00000005',
      legalName: 'Auto Fricker',
      zipCode: '89077',
      city: 'Ulm',
      street: 'Obere Bleiche',
      streetNumber: '2',
      countryId: 'DE',
      countryName: 'Deutschland',
      affiliate: true
    }
  };
}

export function getBusinessSiteWithDistributionLevelSearchItemMock(): SearchItem<any> {
  return {
    id: 'GS00000004',
    type: 'BusinessSite',
    payload: {
      id: 'GS00000008',
      legalName: 'Anakin99',
      zipCode: '66066',
      city: 'Burntown',
      street: 'Route99',
      streetNumber: '99',
      countryId: 'DE',
      countryName: 'Deutschland',
      distributionLevels_retailer: true,
      distributionLevels_wholesaler: false
    }
  };
}

export function getSwitzerlandBusinessSiteFilterOptionMock(): FilterOption {
  return {
    value: 'switzerland',
    matchCount: 2
  };
}

export function getFilterOptionLegalNameMock(): TypedFilterOption {
  return {
    value: 'legalName',
    group: FilterGroup.OUTLET,
    matchCount: 2,
    type: FilterType.TAG
  };
}

export function getFilterOptionRegisteredOfficeMock(): TypedFilterOption {
  return {
    value: 'registeredOffice',
    group: FilterGroup.OUTLET,
    matchCount: 1,
    type: FilterType.FLAG
  };
}

export function getFilterOptionCountryIdChMock(): TypedFilterOption {
  return {
    value: 'CH',
    group: FilterGroup.OUTLET,
    matchCount: 1,
    type: FilterType.FLAG
  };
}

export function getSearchFilterValueBusinessSiteMock(): SearchFilter {
  return new SearchFilterTag('type=businessSite');
}

export function getSearchFilterTagLegalNameDaimlerMock(): SearchFilter {
  return new SearchFilterTag('Daimler', 'legalName');
}

export function getSearchFilterValueDaimlerMock(): SearchFilter {
  return new SearchFilterTag('Daimler');
}

export function getSearchFilterFlagRegisteredOfficeMock(): SearchFilter {
  return new SearchFilterFlag('registeredOffice');
}

export function getTypedFilterOptionBusinessSiteMock(): TypedFilterOption {
  const businessSiteMock = getSearchFilterValueBusinessSiteMock();
  const value = businessSiteMock.value === undefined ? '' : businessSiteMock.value;
  return {
    value: value,
    group: FilterGroup.OUTLET,
    matchCount: 1,
    type: businessSiteMock.type
  };
}

export function getTypedFlagFilterMock(): TypedFilterOption {
  return {
    value: 'active',
    group: FilterGroup.OUTLET,
    matchCount: 1,
    type: FilterType.FLAG
  };
}

export function getTypedFilterOptionLegalNameDaimlerMock(): TypedFilterOption {
  const legalNameDaimlerMock = getSearchFilterTagLegalNameDaimlerMock();
  const value = legalNameDaimlerMock.value === undefined ? '' : legalNameDaimlerMock.value;
  return {
    value: value,
    group: FilterGroup.OUTLET,
    matchCount: 1,
    type: legalNameDaimlerMock.type
  };
}

export function getTypedFilterOptionValueDaimlerMock(): TypedFilterOption {
  const valueDaimlerMock = getSearchFilterValueDaimlerMock();
  const value = valueDaimlerMock.value === undefined ? '' : valueDaimlerMock.value;
  return {
    value: value,
    group: FilterGroup.OUTLET,
    matchCount: 1,
    type: valueDaimlerMock.type
  };
}
