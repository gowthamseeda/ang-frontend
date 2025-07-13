import { Mock } from '../../testing/test-utils/mock';

import { Investee } from './investee.model';

export class InvesteeMock extends Mock {
  static mock: { [key: string]: Investee } = {
    GS00000001: {
      id: 'GS00000001',
      shareCapitalValue: 1000000,
      shareCapitalCurrency: 'EUR',
      investments: [
        {
          investorId: 'GS00000002',
          issuedShareCapitalCurrency: 'EUR',
          issuedShareCapitalValue: 100000,
          active: true
        }
      ]
    }
  };

  static forContracts(): Investee {
    return {
      id: 'GS00000001',
      investments: [
        {
          addressAddition: 'Behind Aldi',
          city: 'London',
          country: 'United Kingdom',
          investorId: 'GS00000002',
          issuedShareCapitalCurrency: 'EUR',
          issuedShareCapitalValue: 100000,
          legalName: 'John Gill',
          street: 'Long Street 42',
          zipCode: '123456',
          kind: 'COMMERCIAL',
          active: true
        }
      ],
      shareCapitalValue: 1000000,
      shareCapitalCurrency: 'EUR'
    };
  }
}
