import { Mock } from '../../../testing/test-utils/mock';

import { Predecessor } from './predecessor.model';

export class PredecessorMock extends Mock {
  static mock: { [key: string]: Predecessor } = {
    GS00000001: {
      id: 'GS00000001',
      predecessors: [
        {
          businessSiteId: 'GS00000002'
        }
      ],
      successors: [
        {
          businessSiteId: 'GS00000003'
        }
      ]
    }
  };

  static forContracts(): Predecessor {
    return {
      id: 'GS00000002',
      predecessors: [
        {
          businessSiteId: 'GS00000006',
          legalName: 'Gyros Souvlakis',
          addressAddition: 'Best ever',
          street: 'Tzatziki',
          streetNumber: '666',
          zipCode: '8280',
          city: 'Moussaka',
          countryId: 'GR',
          countryName: 'Greece'
        }
      ],
      successors: [
        {
          businessSiteId: 'GS00000005',
          legalName: 'John Unchilled',
          addressAddition: 'z. Hd. Herr Unchilled',
          street: 'Auf der Alm',
          streetNumber: '17',
          zipCode: '8280',
          city: 'Zürich',
          countryId: 'NL',
          countryName: 'Netherlands'
        }
      ]
    };
  }
}
