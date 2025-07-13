export interface ProductGroup {
  name: string;
  shortName: string;
  translations?: {
    [key: string]: {
      name: string;
      shortName: string;
    };
  };
}

export interface ProductCategory {
  name: string;
  translations?: { [key: string]: string };
}

export interface Service {
  brandId?: string;
  productCategoryId: string;
  productGroupId?: string;
  serviceId: number;
  serviceName?: string;
  translations?: { [key: string]: string };
}
