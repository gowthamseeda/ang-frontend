import { ComparableAddress } from './comparable-address.model';

export function getComparableAddressSwitzerlandMock(): ComparableAddress {
  return new ComparableAddress('1', 'street', 'city', 'ch', 'zip123');
}
