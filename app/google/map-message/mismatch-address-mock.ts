import { MismatchAddress } from './mismatch-address.model';

export const mismatchAddressMock: MismatchAddress = {
  isStreetNumberMismatched: true,
  currentStreetNumber: 'currentStreetNumber',
  decodedStreetNumber: 'decodedStreetNumber',
  isStreetMismatched: true,
  currentStreet: 'currentStreet',
  decodedStreet: 'decodedStreet',
  isCityMismatched: true,
  currentCity: 'currentCity',
  decodedCity: 'decodedCity',
  isStateMismatched: true,
  currentState: 'currentState',
  decodedState: 'decodedState',
  isCountryMismatched: true,
  currentCountryId: 'currentCountryId',
  decodedCountryId: 'decodedCountryId',
  isZipCodeMismatched: true,
  currentZipCode: 'currentZipCode',
  decodedZipCode: 'decodedZipCode',

  addMismatchStreetNumber(): void {},

  addMismatchStreet(): void {},

  addMismatchCity(): void {},

  addMismatchState(): void {},

  addMismatchCountry(): void {},

  addMismatchZipCode(): void {},

  hasMismatched(): boolean {
    return true;
  }
};
