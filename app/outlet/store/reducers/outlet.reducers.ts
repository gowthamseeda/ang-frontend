import { createReducer, on } from '@ngrx/store';

import { Brand, BrandCode } from '../../models/brand.model';
import { OpeningHours } from '../../models/opening-hours.model';
import { BusinessSite } from '../../models/outlet-profile.model';
import { ProductCategory, ProductGroup, Service } from '../../models/services.model';
import { OutletActions } from '../actions';

export interface OutletProfileState {
  businessSite: BusinessSite;
  businessNames: string[];
  brands: Brand[];
  brandCodes: BrandCode[];
  businessSiteType: string;
  productCategories: ProductCategory[];
  productGroups: ProductGroup[];
  services: Service[];
  openingHours: OpeningHours;
}

export const initialOutletProfileState: OutletProfileState = {
  businessSite: {
    id: '',
    legalName: '',
    registeredOffice: false,
    countryName: '',
    address: {
      addressAddition: '',
      city: '',
      district: '',
      street: '',
      streetNumber: '',
      zipCode: ''
    },
    poBox: {
      city: '',
      number: '',
      zipCode: ''
    },
    hasAssignedLabels: false
  },
  businessNames: [],
  brands: [],
  brandCodes: [],
  businessSiteType: '',
  productCategories: [],
  productGroups: [],
  services: [],
  openingHours: {
    date: '',
    fromTime: '',
    toTime: ''
  }
};

export const reducer = createReducer(
  initialOutletProfileState,
  on(OutletActions.loadOutletProfileSuccess, (state, { profile }) => ({
    ...initialOutletProfileState,
    ...profile
  }))
);
