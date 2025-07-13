import { Address } from '../../models/address.model';

export function getAddressFormMock(): { addresses: Address[] } {
  return {
    addresses: [
      {
        street: 'Salzufer',
        streetNumber: '1',
        zipCode: '10587',
        city: 'Berlin',
        district: 'Mitte',
        addressAddition: 'z. Hd. Frau Müller'
      }
    ]
  };
}
