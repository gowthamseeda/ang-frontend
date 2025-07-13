import { TestBed } from '@angular/core/testing';

import { getCountriesMock } from '../../../geography/country/country.mock';
import { getLanguageMock } from '../../../geography/language/language.mock';

import { SortingService } from './sorting.service';

export function getBrandsWithPositionMock(): {
  brands: { id: string; name: string; position?: number }[];
} {
  return {
    brands: [
      { id: 'FUSO', name: 'FUSO', position: 0 },
      { id: 'MB', name: 'MB', position: 2 },
      { id: 'MYB', name: 'MYB', position: 4 },
      { id: 'SMT', name: 'SMT', position: 1 },
      { id: 'STG', name: 'STG', position: undefined },
      { id: 'WS', name: 'WS', position: 3 }
    ]
  };
}

describe('SortingService', () => {
  const languageListMock = getLanguageMock();

  let service: SortingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortingService]
    });

    service = TestBed.inject(SortingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sortByName()', () => {
    it('should sort country by name', () => {
      const sortedCountries = getCountriesMock().countries.sort(service.sortByName);
      expect(sortedCountries[0].name).toEqual('Switzerland');
    });

    it('should sort language by name', () => {
      const sortedLanguages = languageListMock.languages.sort(service.sortByName);
      expect(sortedLanguages[1].name).toEqual('French (Switzerland)');
    });
  });

  describe('sortById()', () => {
    it('should sort country by id', () => {
      const sortedCountries = getCountriesMock().countries.sort(service.sortById);
      expect(sortedCountries[0].id).toEqual('CH');
    });

    it('should sort language by id', () => {
      const sortedLanguages = languageListMock.languages.sort(service.sortById);
      expect(sortedLanguages[1].id).toEqual('de-DE');
    });
  });

  describe('sortByPosition()', () => {
    it('should sort brand by position', () => {
      const sortedBrands = getBrandsWithPositionMock().brands.sort(service.sortByPosition);
      expect(sortedBrands[0].id).toEqual('STG');
      expect(sortedBrands[1].id).toEqual('FUSO');
      expect(sortedBrands[2].id).toEqual('SMT');
      expect(sortedBrands[3].id).toEqual('MB');
      expect(sortedBrands[4].id).toEqual('WS');
      expect(sortedBrands[5].id).toEqual('MYB');
    });
  });
});
