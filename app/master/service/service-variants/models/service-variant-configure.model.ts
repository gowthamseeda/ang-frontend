export class ServiceVariantConfigure {
  serviceId?: number;
  brandId?: string;
  productGroupId?: string;
  active: boolean;

  constructor(serviceId?: number, brandId?: string, productGroupId?: string, active?: boolean) {
    this.serviceId = serviceId;
    this.brandId = brandId;
    this.productGroupId = productGroupId;
    this.active = active ?? false;
  }
}

export class ServiceVariantResponse {
  fail: MasterServiceVariantResponse[];
  success: MasterServiceVariantResponse[];
}

export class MasterServiceVariantResponse {
  serviceId: number;
  productCategoryId: number;
  brandId: string;
  productGroupId: string;
  message?: string[];
}
