import { Validity } from '../../validity/validity.model';

export interface MultiSelect {
  targets: MultiSelectOfferedServiceIds[];
  mode: MultiSelectMode;
  offeredServiceSelectionList: MultiSelectOfferedServiceIds[];
}

export interface MultiSelectOfferedServiceIds {
  id: string;
  serviceId: number;
  brandId: string;
  productGroupId: string;
  serviceCharactereisticId?: string;
  productCategoryId: number;
  outletId:string;
}

export enum MultiSelectMode {
  COPY,
  EDIT
}

export interface MultiSelectOfferedServiceList {
  offeredServiceAddedList: MultiSelectOfferedService[];
  offeredServiceChangedList: MultiSelectOfferedService[];
  offeredServiceRemovedList: MultiSelectOfferedService[];
}

export interface MultiSelectOfferedService {
  id: string;
  serviceId: number;
  brandId: string;
  productGroupId: string;
  serviceCharacteristicId?: string;
  productCategoryId: number;
  validity?: Validity;
}
