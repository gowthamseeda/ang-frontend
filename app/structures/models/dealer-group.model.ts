import { StructuresCountry, StructuresMember } from '../shared/models/shared.model';

export class DealerGroups {
  dealerGroups: DealerGroup[];
}
export class DealerGroup {
  dealerGroupId: string;
  name: string;
  active: boolean;
  headquarter: DealerGroupHeadquarter;
  country: StructuresCountry;
  successorGroup?: DealerGroupSuccessor;
  members?: DealerGroupMember[];
}

export class DealerGroupHeadquarter {
  id: string;
  legalName: string;
  address: Address;
  isRegisteredOffice: boolean;
  brandCodes?: DealerGroupBrandCode[];
}

export class Address {
  street?: string;
  streetNumber?: string;
  city: string;
  zipCode?: string;
}

export class Country {
  id: string;
  name: string;
}

export class DealerGroupMember extends StructuresMember {}

export class DealerGroupMemberWithRO {
  registeredOffice: DealerGroupMember;
  members: DealerGroupMember[];
}

export class DealerGroupSuccessor {
  id: string;
  name: string;
}
export class DealerGroupHeadquarterAdded extends DealerGroupHeadquarter {
  countryId: string;
  countryName: string;
}

export class DealerGroupBrandCode {
  brandCode: string;
  brandId: string;
}
