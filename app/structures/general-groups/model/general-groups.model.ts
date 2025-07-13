import { StructuresCountry, StructuresMember } from '../../shared/models/shared.model';

export class GeneralGroups {
  generalGroups: GeneralGroup[];
}

export class GeneralGroup {
  generalGroupId: string;
  name: string;
  active: boolean;
  country: StructuresCountry;
  members?: GeneralGroupMember[] | undefined;
  brandProductGroupServices?: GeneralGroupBrandProductGroupService[] | undefined;
  successorGroup?: GeneralGroupSuccessor | undefined;
}

export class GeneralGroupMember extends StructuresMember {}

export class GeneralGroupBrandProductGroupService {
  brand: GeneralGroupBrand;
  productGroup: GeneralGroupProductGroup;
  service: GeneralGroupService;
}

export class GeneralGroupBrand {
  id: string;
  name: string;
}

export class GeneralGroupProductGroup {
  id: string;
  name: string;
}

export class GeneralGroupService {
  id: number;
  name: string;
}

export class GeneralGroupSuccessor {
  id: string;
  name: string;
}
