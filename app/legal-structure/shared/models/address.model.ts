export interface Address {
  street: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  district: string;
  addressAddition: string;
}

export enum AddressType {
  Main = 'address',
  Additional = 'additionalAddress'
}

export interface OutletAddressTranslation {
  street: string;
  streetNumber: string;
  city: string;
  district: string;
  addressAddition: string;
}
