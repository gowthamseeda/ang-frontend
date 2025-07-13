import { createSelector } from '@ngrx/store';

import { selectStructuresState, StructuresState } from '../../../store';
import { OutletStructure, OutletStructureOutlets } from '../../model/outlet-structure.model';
import { OutletStructureState } from '../reducers';

export const selectOutletStructure = createSelector(
  selectStructuresState,
  (state: StructuresState) => {
    return state.outletStructure;
  }
);

export const selectStructure = createSelector(
  selectOutletStructure,
  (state: OutletStructureState) => {
    return state.structure;
  }
);

export const selectOutlets = createSelector(selectStructure, (outletStructure: OutletStructure) => {
  return outletStructure ? outletStructure.outlets : [];
});

export const structureOutletsContainAtLeastOneMainOutlet = createSelector(
  selectOutlets,
  (outlets: OutletStructureOutlets[]) => {
    return outlets.find(outlet => outlet.mainOutlet) !== undefined;
  }
);

export const selectMainOutlets = createSelector(
  selectOutlets,
  (outlets: OutletStructureOutlets[]) => {
    return outlets.filter(outlet => outlet.mainOutlet);
  }
);

export const selectSiblingOutletIds = createSelector(
  selectOutlets,
  (outlets: OutletStructureOutlets[], { outletId }: { outletId: string }) => {
    const siblingOutletIds: string[] = [];
    if (!outlets) {
      return [];
    }

    outlets.map(currentOutlet => {
      if (currentOutlet.subOutlets) {
        const sourceOutlet = currentOutlet.subOutlets.find(sub => sub.businessSiteId === outletId);
        if (sourceOutlet) {
          currentOutlet.subOutlets.map(sublet => {
            siblingOutletIds.push(sublet.businessSiteId);
            return sublet.businessSiteId;
          });
        }
      }
    });
    return siblingOutletIds;
  }
);

export const selectSubletIds = createSelector(
  selectOutlets,
  (outlets: OutletStructureOutlets[], { outletId }: { outletId: string }) => {
    const subletIds: string[] = [];
    if (!outlets) {
      return [];
    }

    const sourceOutlet = outlets.find(curOutlet => curOutlet.businessSiteId === outletId);

    if (sourceOutlet && sourceOutlet.subOutlets) {
      sourceOutlet.subOutlets.map(sublet => {
        subletIds.push(sublet.businessSiteId);
      });
    }
    return subletIds;
  }
);

export const selectSubletParentId = createSelector(
  selectOutlets,
  (outlets: OutletStructureOutlets[], { outletId }: { outletId: string }) => {
    let subletParentId = '';
    if (!outlets) {
      return '';
    }

    outlets.map(currentOutlet => {
      if (currentOutlet.subOutlets) {
        const source = currentOutlet.subOutlets.find(sub => sub.businessSiteId === outletId);
        if (source) {
          subletParentId = currentOutlet.businessSiteId;
          return;
        }
      }
    });
    return subletParentId;
  }
);
