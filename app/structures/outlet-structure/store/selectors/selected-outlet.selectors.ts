import { createSelector } from '@ngrx/store';

import { sortByReference } from '../../../../shared/util/arrays';
import { selectStructuresState, StructuresState } from '../../../store';
import { BrandCode, OutletStructureOutlets } from '../../model/outlet-structure.model';
import { OutletStructureState } from '../reducers';

import { selectOutletStructure } from './outlet-structure.selectors';

export const selectSelectedOutlet = createSelector(
  selectOutletStructure,
  (state: OutletStructureState) => {
    return state.selectedOutlet;
  }
);

export const selectAvailableBrandIdsState = createSelector(
  selectStructuresState,
  (state: StructuresState) => {
    return ['MB', 'SMT', 'STR', 'FUSO', 'THB', 'BAB', 'FTL', 'WST', 'STG', 'THB', 'MYB'];
  }
);

export const selectLegalNameFromSelectedOutletState = createSelector(
  selectSelectedOutlet,
  (state: OutletStructureOutlets) => {
    return state.legalName;
  }
);

export const selectOutletBrandState = createSelector(
  selectSelectedOutlet,
  selectAvailableBrandIdsState,
  (selectedOutlet: OutletStructureOutlets, allBrandIds: string[]) => {
    let outletBrandIds: string[] = [];
    if (selectedOutlet?.brandCodes) {
      selectedOutlet?.brandCodes.forEach((brandCode: BrandCode) => {
        outletBrandIds.push(brandCode.brandId);
      });
    }
    outletBrandIds = outletBrandIds.filter((v, i) => outletBrandIds.indexOf(v) === i);
    return sortByReference<string, string>(outletBrandIds, allBrandIds, (elem: string) =>
      elem.toUpperCase()
    );
  }
);

export const selectedOutletHasSubOutlets = createSelector(
  selectSelectedOutlet,
  (selectedOutlet: OutletStructureOutlets) => {
    return selectedOutlet?.subOutlets !== undefined && selectedOutlet?.subOutlets.length > 0;
  }
);

export const selectedOutletIsAttachedToMarketStructure = createSelector(
  selectSelectedOutlet,
  (selectedOutlet: OutletStructureOutlets) => {
    return selectedOutlet?.mainOutlet || selectedOutlet?.subOutlet;
  }
);

export const selectFirstTwoBrandsOfSelectedOutlet = createSelector(
  selectSelectedOutlet,
  selectAvailableBrandIdsState,
  (selectedOutlet: OutletStructureOutlets, allBrandIds: string[]) => {
    let brandCodes: string[] = [];

    if (selectedOutlet?.brandCodes) {
      const sortedByBrandId = sortByReference<BrandCode, string>(
        selectedOutlet?.brandCodes,
        allBrandIds,
        (tmp: BrandCode) => tmp.brandId.toUpperCase()
      );

      sortedByBrandId.forEach((brandCode: BrandCode) => {
        brandCodes.push(brandCode.brandCode);
      });

      brandCodes = brandCodes.filter((v, i) => brandCodes.indexOf(v) === i);
    }

    return brandCodes.slice(0, 2);
  }
);
