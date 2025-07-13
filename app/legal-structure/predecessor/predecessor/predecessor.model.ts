export class Predecessor {
  id: string;
  predecessors: PredecessorItem[];
  successors: PredecessorItem[];
}

export class PredecessorItem {
  businessSiteId: string;
  legalName?: string;
  addressAddition?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
  city?: string;
  countryId?: string;
  countryName?: string;
  brandCode?: string;
}
