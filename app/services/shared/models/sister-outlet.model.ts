export interface SisterOutlet {
  id: string;
  companyId: string;
  distributionLevels: string[];
  active: boolean;
  legalName: string;
  address: {
    street: string;
    streetNumber: string;
    addressAddition: string;
    zipCode: string;
    city: string;
    district: string;
    countryId: string;
  };
}
