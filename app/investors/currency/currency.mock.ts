import { Mock } from '../../testing/test-utils/mock';

import { Currency } from './currency.model';

export class CurrencyMock extends Mock {
  static mock: { [id: string]: Currency } = {
    EUR: { id: 'EUR', name: 'Euro' },
    USD: { id: 'USD', name: 'Dollar' }
  };
}
