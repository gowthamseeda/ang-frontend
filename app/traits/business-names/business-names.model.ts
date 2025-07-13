import { TaskData } from 'app/tasks/task.model';

import { Brand } from '../brand.model';

export class GroupedBusinessName {
  name: string;
  brands: Brand[];
  deleted = false;
  readonly = false;
  translations?: any;

  constructor(name?: string, brands?: Brand[], translations?: any, readonly?: boolean) {
    this.name = name || '';
    this.brands = brands || [];
    this.translations = translations;
    this.readonly = readonly || false;
  }
}

export namespace GroupedBusinessName {
  export function hasReadonlyBrand(businessName: GroupedBusinessName): boolean {
    return businessName.brands.some(brand => brand.readonly);
  }
}

export interface FlatBusinessName {
  businessName: string;
  taskData?: TaskData;
  brandId: string;
  translations?: any;
}
