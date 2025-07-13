import { createReducer, on } from '@ngrx/store';

import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import { DistributionLevelActions, OutletStructureActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(OutletStructureActions.loadOutletStructureSuccess, (state, { outletStructure, outletId }) => {
    let selectedOutlet: OutletStructureOutlets | undefined;
    for (const outlet of outletStructure.outlets) {
      if (outletId === outlet.businessSiteId) {
        selectedOutlet = outlet;
        break;
      } else if (outlet.subOutlets) {
        const result = outlet.subOutlets.filter(subOutlet => subOutlet.businessSiteId === outletId);
        if (result.length >= 1) {
          selectedOutlet = result[0];
          break;
        }
      }
    }

    if (!selectedOutlet) {
      return initialState;
    }

    return {
      active: selectedOutlet.active,
      brandCodes: selectedOutlet.brandCodes,
      businessNames: selectedOutlet.businessNames,
      businessSiteId: selectedOutlet.businessSiteId,
      city: selectedOutlet.city,
      companyId: selectedOutlet.companyId,
      countryId: selectedOutlet.countryId,
      distributionLevels: selectedOutlet.distributionLevels,
      legalName: selectedOutlet.legalName,
      marketStructureEnabled: selectedOutlet.marketStructureEnabled,
      registeredOffice: selectedOutlet.registeredOffice,
      subOutlet: selectedOutlet.subOutlet,
      subOutlets: selectedOutlet.subOutlets,
      mainOutlet: selectedOutlet.mainOutlet
    } as OutletStructureOutlets;
  }),
  on(DistributionLevelActions.loadDistributionLevelSuccess, (state, { distributionLevels }) => {
    if (state) {
      return { ...state, distributionLevels: distributionLevels };
    }
    return state;
  }),
  on(DistributionLevelActions.loadDistributionLevelFailure, (state, {}) => {
    if (state) {
      return { ...state, distributionLevels: [] };
    }
    return state;
  })
);
