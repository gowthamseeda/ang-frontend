import { selectAddressState } from './extended.selectors';

describe('Address Selectors', () => {
  test('should return translated country name', () => {
    const outletState = {
      legalName: 'Test-Outlet',
      companyLegalName: 'Test-Outlet',
      companyId: 'GC0001948',
      countryId: 'DE',
      address: {
        street: 'Aachener Straße',
        streetNumber: '999',
        zipCode: '50933',
        city: 'Köln'
      },
      id: 'GS0001948',
      affiliate: false
    };
    const countryState = {
      id: 'DE',
      name: 'Deutschland',
      defaultLanguageId: 'de-DE',
      languages: ['de-DE'],
      translations: {
        'de-DE': 'Deutschland',
        'en-UK': 'Germany'
      }
    };
    const languageState = 'en-UK';

    const selection = (selectAddressState.projector as any)(outletState, countryState, languageState);

    expect(selection).toStrictEqual({
      street: 'Aachener Straße',
      streetNumber: '999',
      zipCode: '50933',
      city: 'Köln',
      countryName: 'Germany'
    });
  });

  test('should return countryName only', () => {
    const outletState = {
      legalName: 'Test-Outlet',
      companyLegalName: 'Test-Outlet',
      companyId: 'GC0001948',
      countryId: 'DE',
      address: {},
      id: 'GS0001948',
      affiliate: false
    };
    const countryState = {
      id: 'DE',
      name: 'Deutschland',
      defaultLanguageId: 'de-DE',
      languages: ['de-DE'],
      translations: {
        'de-DE': 'Deutschland',
        'en-UK': 'Germany'
      }
    };
    const languageState = 'de-DE';

    const selection = (selectAddressState.projector as any)(outletState, countryState, languageState);

    expect(selection).toStrictEqual({
      countryName: 'Deutschland'
    });
  });
});
