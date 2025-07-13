import { ComparableAddress } from './comparable-address.model';
import { getComparableAddressSwitzerlandMock } from './comparable-address.mock';
import { MismatchAddress } from './mismatch-address.model';

describe('ComparableAddress Test Suite', () => {
  const comparableAddressMock = getComparableAddressSwitzerlandMock();

  describe('checkForMatchWith', () => {
    it('should not recognize a mismatch if equal data', () => {
      const addressWithMismatchingCountry = new ComparableAddress(
        comparableAddressMock.streetNumber,
        comparableAddressMock.street,
        comparableAddressMock.city,
        comparableAddressMock.country,
        comparableAddressMock.zipCode
      );

      const expectedMismatch = new MismatchAddress();

      addressWithMismatchingCountry.checkForMatchWith(comparableAddressMock);
      expect(addressWithMismatchingCountry.mismatchAddress).toStrictEqual(expectedMismatch);
    });

    it('should not recognize a mismatch because of letter capitalization', () => {
      const addressWithMismatchingCountry = new ComparableAddress(
        comparableAddressMock.streetNumber,
        comparableAddressMock.street,
        comparableAddressMock.city,
        comparableAddressMock.country?.toUpperCase(),
        comparableAddressMock.zipCode
      );

      const expectedMismatch = new MismatchAddress();

      addressWithMismatchingCountry.checkForMatchWith(comparableAddressMock);
      expect(addressWithMismatchingCountry.mismatchAddress).toStrictEqual(expectedMismatch);
    });

    it('should not recognize a mismatch if compareTo has no value', () => {
      const addressWithMismatchingCountry = new ComparableAddress(
        comparableAddressMock.streetNumber,
        comparableAddressMock.street,
        comparableAddressMock.city,
        '',
        comparableAddressMock.zipCode
      );

      const expectedMismatch = new MismatchAddress();

      addressWithMismatchingCountry.checkForMatchWith(comparableAddressMock);
      expect(addressWithMismatchingCountry.mismatchAddress).toStrictEqual(expectedMismatch);
    });

    it('should recognize countryId mismatch', () => {
      const addressWithMismatchingCountry = new ComparableAddress(
        comparableAddressMock.streetNumber,
        comparableAddressMock.street,
        comparableAddressMock.city,
        'otherCountry',
        comparableAddressMock.zipCode
      );

      const expectedMismatch = new MismatchAddress();
      expectedMismatch.decodedCountryId = 'otherCountry';
      expectedMismatch.currentCountryId = comparableAddressMock.country;
      expectedMismatch.isCountryMismatched = true;

      addressWithMismatchingCountry.checkForMatchWith(comparableAddressMock);
      expect(addressWithMismatchingCountry.mismatchAddress).toStrictEqual(expectedMismatch);
    });
  });
});
