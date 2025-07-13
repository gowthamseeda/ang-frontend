import { MismatchAddress } from './mismatch-address.model';

export class ComparableAddress {
  streetNumber?: string;
  street?: string;
  city?: string;
  country?: string;
  zipCode?: string;

  mismatchAddress: MismatchAddress;

  constructor(
    streetNumber?: string,
    street?: string,
    city?: string,
    country?: string,
    zipCode?: string
  ) {
    this.streetNumber = streetNumber;
    this.street = street;
    this.city = city;
    this.country = country;
    this.zipCode = zipCode;
  }

  checkForMatchWith(address: ComparableAddress): boolean {
    this.mismatchAddress = new MismatchAddress();
    if (
      this.streetNumber &&
      address.streetNumber &&
      this.streetNumber.toLowerCase() !== address.streetNumber.toLowerCase()
    ) {
      this.mismatchAddress.addMismatchStreetNumber(address.streetNumber, this.streetNumber);
    }

    if (
      this.street &&
      address.street &&
      this.street.toLowerCase() !== address.street.toLowerCase()
    ) {
      this.mismatchAddress.addMismatchStreet(address.street, this.street);
    }

    if (this.city && address.city && this.city.toLowerCase() !== address.city.toLowerCase()) {
      this.mismatchAddress.addMismatchCity(address.city, this.city);
    }

    if (
      this.country &&
      address.country &&
      this.country?.toLowerCase() !== address.country?.toLowerCase()
    ) {
      this.mismatchAddress.addMismatchCountry(address.country, this.country);
    }

    if (
      this.zipCode &&
      address.zipCode &&
      this.zipCode.toLowerCase() !== address.zipCode.toLowerCase()
    ) {
      this.mismatchAddress.addMismatchZipCode(address.zipCode, this.zipCode);
    }

    return this.mismatchAddress.hasMismatched();
  }
}
