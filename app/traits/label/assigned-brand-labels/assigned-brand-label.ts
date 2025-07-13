import { Brand } from '../../brand.model';

export class AssignedBrandLabel {
  labelId: number;
  brandId: string;
  name: string;
  translations?: Object;
}

export interface FlatAssignedBrandLabel {
  labelId: number | undefined;
  brandId: string;
}

export class GroupedAssignedBrandLabel {
  labelId: number | undefined;
  brands: Brand[];
  deleted: boolean;

  constructor(labelId?: number, brands?: Brand[], readonly?: boolean, deleted?: boolean) {
    this.labelId = labelId || undefined;
    this.brands = brands || [];
    this.deleted = deleted || false;
  }
}

export namespace AssignedBrandLabel {
  export function hasReadonlyBrand(assignedBrandLabel: GroupedAssignedBrandLabel): boolean {
    return assignedBrandLabel.brands.some(brand => brand.readonly);
  }
}
