import { AbstractControl } from '@angular/forms';

export class POBoxValidators {
  static poBoxNumberRequired(poBox: AbstractControl | null): boolean {
    if (poBox) {
      return (
        !POBoxValidators.poBoxZipCodeEmpty(poBox.value) ||
        !POBoxValidators.poBoxCityEmpty(poBox.value)
      );
    }

    return false;
  }

  static poBoxZipCodeRequired(countryId: string, poBox: AbstractControl | null): boolean {
    if (!POBoxValidators.poBoxDetailsRequiredForCountry(countryId)) {
      return false;
    }

    if (poBox) {
      return (
        !POBoxValidators.poBoxNumberEmpty(poBox.value) ||
        !POBoxValidators.poBoxCityEmpty(poBox.value)
      );
    }

    return false;
  }

  static poBoxCityRequired(countryId: string, poBox: AbstractControl | null): boolean {
    if (!POBoxValidators.poBoxDetailsRequiredForCountry(countryId)) {
      return false;
    }

    if (poBox) {
      return (
        !POBoxValidators.poBoxNumberEmpty(poBox.value) ||
        !POBoxValidators.poBoxZipCodeEmpty(poBox.value)
      );
    }

    return false;
  }

  static poBoxDetailsRequiredForCountry(countryId: string): boolean {
    switch (countryId) {
      case 'FR':
        return false;
    }

    return true;
  }

  static poBoxZipCodeEmpty(poBox: any): boolean {
    if (poBox === null || poBox === undefined) {
      return true;
    }

    return poBox.zipCode === undefined || poBox.zipCode === null || poBox.zipCode.length === 0;
  }

  static poBoxCityEmpty(poBox: any): boolean {
    if (poBox === null || poBox === undefined) {
      return true;
    }
    return poBox.city === undefined || poBox.city === null || poBox.city.length === 0;
  }

  static poBoxNumberEmpty(poBox: any): boolean {
    if (poBox === null || poBox === undefined) {
      return true;
    }
    return poBox.number === undefined || poBox.number === null || poBox.number.length === 0;
  }
}
