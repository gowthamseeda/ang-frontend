export enum AdminType {
  moveOutlet,
  switchRegisteredOffice
}

export enum ConstraintType {
  MOVEREGISTEREDOFFICE = 'MOVEREGISTEREDOFFICE',
  BUSINESSSITEINACTIVE = 'BUSINESSSITEINACTIVE',
  COMPANYINACTIVE = 'COMPANYINACTIVE',
  OUTLETSTRUCTURE = 'OUTLETSTRUCTURE',
  DEALERGROUP = 'DEALERGROUP',
  REGIONALCENTER = 'REGIONALCENTER',
  MARKETAREA = 'MARKETAREA',
  TASK = 'TASK',
  CONTRACTEE = 'CONTRACTEE',
  OTHER = 'OTHER'
}
export class OutletStatus {
  current?: OutletDetails | null;
  previous?: OutletDetails | null;
  isAddCurrentSelected?: boolean;
  isAddPreviousSelected?: boolean;
}

export class OutletDetails {
  city: string;
  companyId: string;
  countryName: string;
  isRegisteredOffice: boolean;
  legalName: string;
  outletId: string;
  state: string;
  streetNumber: string;
  street: string;
  zipCode: string;
  isActive: boolean;
}
