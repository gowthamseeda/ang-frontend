export class Investee {
  id: string;
  shareCapitalValue: number;
  shareCapitalCurrency: string;
  investments?: Investment[];
}

export class Investment {
  id?: number;
  investorId: string;
  issuedShareCapitalValue?: number;
  issuedShareCapitalCurrency?: string;
  issuedShare?: number;
  active?: boolean;
  legalName?: string;
  street?: string;
  addressAddition?: string;
  zipCode?: string;
  city?: string;
  countryId?: string;
  countryName?: string;
  country?: string;
  kind?: string;
}
