import { Brand } from './brand.model';
import { Mock } from '../../testing/test-utils/mock';

export class BrandMock extends Mock {
  static mock: { [id: string]: Brand } = {
    MB: { id: 'MB', name: 'Mercedes-Benz' },
    SMT: { id: 'SMT', name: 'Smart' },
    FL: { id: 'FL', name: 'Freightliner' },
    FUSO: { id: 'FUSO', name: 'FUSO' },
    WS: { id: 'WS', name: 'Western Star' },
    TB: { id: 'TB', name: 'Thomas Built' }
  };
}
