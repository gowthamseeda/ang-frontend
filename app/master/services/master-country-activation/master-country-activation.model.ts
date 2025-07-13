export class MasterCountryActivation {
  activationId: number;
  countryId: string;
  type = 'MARKET_STRUCTURES';

  constructor(countryId: string) {
    this.countryId = countryId;
  }
}
