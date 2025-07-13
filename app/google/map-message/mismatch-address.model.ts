export class MismatchAddress {
  isStreetNumberMismatched: boolean;
  currentStreetNumber?: string;
  decodedStreetNumber?: string;
  isStreetMismatched: boolean;
  currentStreet?: string;
  decodedStreet?: string;
  isCityMismatched: boolean;
  currentCity?: string;
  decodedCity?: string;
  isStateMismatched: boolean;
  currentState?: string;
  decodedState?: string;
  isCountryMismatched: boolean;
  currentCountryId?: string;
  decodedCountryId?: string;
  isZipCodeMismatched: boolean;
  currentZipCode?: string;
  decodedZipCode?: string;

  addMismatchStreetNumber(currentStreetNumber: string, decodedStreetNumber: string): void {
    this.isStreetNumberMismatched = true;
    this.currentStreetNumber = currentStreetNumber;
    this.decodedStreetNumber = decodedStreetNumber;
  }

  addMismatchStreet(currentStreet: string, decodedStreet: string): void {
    this.isStreetMismatched = true;
    this.currentStreet = currentStreet;
    this.decodedStreet = decodedStreet;
  }

  addMismatchCity(currentCity: string, decodedCity: string): void {
    this.isCityMismatched = true;
    this.currentCity = currentCity;
    this.decodedCity = decodedCity;
  }

  addMismatchState(currentState: string, decodedState: string): void {
    this.isStateMismatched = true;
    this.currentState = currentState;
    this.decodedState = decodedState;
  }

  addMismatchCountry(currentCountryId: string, decodedCountryId: string): void {
    this.isCountryMismatched = true;
    this.currentCountryId = currentCountryId;
    this.decodedCountryId = decodedCountryId;
  }

  addMismatchZipCode(currentZipCode: string, decodedZipCode: string): void {
    this.isZipCodeMismatched = true;
    this.currentZipCode = currentZipCode;
    this.decodedZipCode = decodedZipCode;
  }

  hasMismatched(): boolean {
    if (
      this.isStreetNumberMismatched ||
      this.isStreetMismatched ||
      this.isCityMismatched ||
      this.isStateMismatched ||
      this.isCountryMismatched ||
      this.isZipCodeMismatched
    ) {
      return true;
    }
    return false;
  }
}
