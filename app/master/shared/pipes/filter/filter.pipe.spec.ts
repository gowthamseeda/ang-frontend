import { Country } from '../../../../geography/country/country.model';
import { getCountriesMock } from '../../../../geography/country/country.mock';
import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  const countries = getCountriesMock().countries;
  const pipe = new FilterPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform()', () => {
    let expected: Country[];
    let searchText: string;

    it('should return countries if no search text', () => {
      expected = countries;
      searchText = '';
      expect(pipe.transform(countries, searchText)).toEqual(expected);
    });

    it('should return empty array if no match found', () => {
      expected = [];
      searchText = 'Malaysia';
      expect(pipe.transform(countries, searchText)).toEqual(expected);
    });

    it('should return United Kingdom if match in countries', () => {
      expected = [countries[0]];
      searchText = 'United';
      expect(pipe.transform(countries, searchText)).toEqual(expected);
    });

    it('should return Switzerland if match in countries', () => {
      expected = [countries[1]];
      searchText = 'witzer';
      expect(pipe.transform(countries, searchText)).toEqual(expected);
    });

    it('should filter country by id', () => {
      expected = [countries[0]];
      searchText = 'GB';
      expect(pipe.transform(countries, searchText, 'id')).toEqual(expected);
    });
  });
});
