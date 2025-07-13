import { ProductGroup } from './product-group.model';
import { Mock } from '../../testing/test-utils/mock';

export class ProductGroupMock extends Mock {
  static mock: { [id: string]: ProductGroup } = {
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
