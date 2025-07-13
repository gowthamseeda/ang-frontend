import { Mock } from '../../../testing/test-utils/mock';

import { MasterBrand } from './master-brand.model';

export class MasterBrandMock extends Mock {
  static mock: { [id: string]: MasterBrand } = {
    MB: { id: 'MB', name: 'Mercedes-Benz' },
    FUSO: { id: 'FUSO', name: 'FUSO' }
  };
}
