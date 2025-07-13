export type OutletResult = BusinessSite &
  Address &
  PoBox &
  AssignedKeys &
  DistributionLevels &
  OutletStructure & {
    businessNames: string[];
    offeredServices: string[];
  };

interface BusinessSite {
  id: string;
  legalName: string;
  companyId: string;
  countryId: string;
  countryName: string;
  nameAddition: string;
  registeredOffice: boolean;
  affiliate: boolean;
  active: boolean;
  activeOrInPlanning: boolean;
  undefined: boolean;
  notification: boolean | null;
  notificationType: string;
}

interface Address {
  street: string;
  streetNumber: string;
  addressAddition: string;
  zipCode: string;
  city: string;
  district: string;
  province: string;
  state: string;
}

interface PoBox {
  poBoxZipCode: string;
  poBoxCity: string;
  poBoxNumber: string;
}

interface AssignedKeys {
  alias: string;
  brandCodes: string[];
}

interface DistributionLevels {
  distributionLevels_applicant: boolean;
  distributionLevels_manufacturer: boolean;
  distributionLevels_retailer: boolean;
  distributionLevels_wholesaler: boolean;
}

interface OutletStructure {
  mainOutlet: boolean;
  subOutlet: boolean;
}
