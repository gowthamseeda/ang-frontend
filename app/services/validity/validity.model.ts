import { OfferedService } from '../offered-service/offered-service.model';

export class Validity {
  application?: boolean;
  applicationValidUntil?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  valid?: boolean;

  constructor(validity: Validity) {
    if (validity.application) {
      this.application = validity.application;
    }
    if (validity.applicationValidUntil) {
      this.applicationValidUntil = validity.applicationValidUntil;
    }
    if (validity.validFrom) {
      this.validFrom = validity.validFrom;
    }
    if (validity.validUntil) {
      this.validUntil = validity.validUntil;
    }
    if (validity.valid != null) {
      this.valid = validity.valid;
    }
  }
}

export class OfferedServiceValidity {
  id: string;
  validity?: Validity;

  constructor(offeredServiceValidity: OfferedServiceValidity) {
    this.id = offeredServiceValidity.id;

    if (offeredServiceValidity.validity) {
      this.validity = new Validity(offeredServiceValidity.validity);
    }
  }
}

export class MultiOfferedService {
  businessSiteId: String;
  offeredServicesList?: OfferedServices;

  constructor(businessSiteId: String, offeredServicesList?: OfferedServices) {
    this.businessSiteId = businessSiteId;
    this.offeredServicesList = offeredServicesList;
  }
}

export class OfferedServices {
  offeredServices: OfferedServiceResource[];

  constructor(offeredServices: OfferedServiceResource[]) {
    this.offeredServices = offeredServices;
  }
}

export class OfferedServiceResource {
  id: String;
  serviceId: number;
  productCategoryId: number;
  brandId: String;
  productGroupId: String;
  validity: Validity;
}

export class ValidityTableRow extends Validity {
  offeredServicesMap: { [key: string]: OfferedService };
}

export interface ValidityChange {
  ids: string[];
  validity?: Validity;
  rowIndex?: number;
}
