import { Mock } from '../../../testing/test-utils/mock';

import { MasterProductGroup } from './master-product-group.model';

export class MasterProductGroupMock extends Mock {
  static mock: { [id: string]: MasterProductGroup } = {
    PC: { id: 'PC', name: 'Passenger Car', shortName: 'PC' },
    VAN: {
      id: 'VAN',
      name: 'Van',
      shortName: 'VA',
      translations: {
        'de-DE': {
          name: 'Transporter',
          shortName: 'TP'
        }
      }
    }
  };
}
