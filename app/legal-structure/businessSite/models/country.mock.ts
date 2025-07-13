import { Country } from '../../../geography/country/country.model';

export function getCountryMock(): Country {
  return {
    id: 'CH',
    name: 'Switzerland',
    languages: ['de-CH', 'fr-CH']
  };
}
