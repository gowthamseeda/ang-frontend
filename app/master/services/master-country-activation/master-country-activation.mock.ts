import { MasterCountryActivation } from './master-country-activation.model';

export function getMasterCountriesActivationMock(): MasterCountryActivation[] {
  return [
    { activationId: 1, countryId: 'CH', type: 'MARKET_STRUCTURES' },
    { activationId: 2, countryId: 'GB', type: 'MARKET_STRUCTURES' }
  ];
}

export function getMasterCountriesActivationSingleMock(): any {
  return { countryId: 'CH', type: 'MARKET_STRUCTURES' };
}
