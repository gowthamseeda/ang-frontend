import { createSelector } from '@ngrx/store';

import { MenuItem } from '../../container/outlet-tree-navigation/outlet-tree-navigation-menu-item.model';
import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import { FlatStructureNode } from '../../presentational/outlet-structure-tree/model/flat-structure-node.model';

import { selectIsLoadingErrorState } from './loading-status.selectors';
import {
  selectMainOutlets,
  selectOutlets,
  structureOutletsContainAtLeastOneMainOutlet
} from './outlet-structure.selectors';
import {
  selectedOutletHasSubOutlets,
  selectedOutletIsAttachedToMarketStructure,
  selectSelectedOutlet
} from './selected-outlet.selectors';

export const selectMarketStructureTag = createSelector(
  selectSelectedOutlet,
  (selectedOutlet: OutletStructureOutlets) => {
    const tags: string[] = [];
    if (selectedOutlet) {
      if (selectedOutlet?.mainOutlet) {
        tags.push('MAIN_OUTLET');
      }
      if (selectedOutlet?.subOutlet) {
        tags.push('SUB_OUTLET');
      }
    }
    return tags;
  }
);

const isSubOutletOf = (mainOutlet: OutletStructureOutlets, outlet: OutletStructureOutlets) => {
  if (!mainOutlet.subOutlets) {
    return false;
  }
  return (
    mainOutlet.subOutlets.find(subOutlet => subOutlet.businessSiteId === outlet.businessSiteId) !==
    undefined
  );
};

export const selectAvailableActionsOfSelectedStructureNode = createSelector(
  selectSelectedOutlet,
  selectedOutletHasSubOutlets,
  selectedOutletIsAttachedToMarketStructure,
  selectMainOutlets,
  structureOutletsContainAtLeastOneMainOutlet,
  (
    selectedOutlet: OutletStructureOutlets,
    selectedOutletHasSubs: boolean,
    isAttachedToMarketStructure: boolean,
    mainOutlets: OutletStructureOutlets[],
    outletsContainMainOutlet: boolean
  ) => {
    const items = new Array<MenuItem>();
    if (selectedOutlet?.mainOutlet) {
      items.push({
        label: 'REMOVE_ALL_SUB_OUTLETS',
        action: 'USER_ACTION_REMOVE_ALL_SUBLETS',
        disabled: !selectedOutlet?.marketStructureEnabled || !selectedOutletHasSubs
      });
    }
    items.push({
      label: 'MAKE_MAIN_OUTLET',
      action: 'USER_ACTION_MAKE_MAIN_OUTLET',
      disabled: !selectedOutlet?.marketStructureEnabled || selectedOutlet?.mainOutlet
    });
    items.push({
      label: selectedOutlet?.subOutlet ? 'REMOVE_SUB_OUTLET' : 'DETACH_FROM_MARKET_VIEW',
      action: 'USER_ACTION_DETACH_FROM_MARKET_STRUCTURE',
      disabled:
        !selectedOutlet?.marketStructureEnabled ||
        !isAttachedToMarketStructure ||
        selectedOutletHasSubs
    });

    if (outletsContainMainOutlet) {
      items.push({
        label: '',
        action: ''
      });
      items.push({
        label: selectedOutlet?.subOutlet ? 'MOVE_SUB_OUTLET_TO' : 'MAKE_SUB_OUTLET_OF',
        action: ''
      });
      mainOutlets.forEach(mainOutlet => {
        items.push({
          label: `${mainOutlet.businessSiteId} - ${mainOutlet.city}`,
          action: 'USER_ACTION_MAKE_SUBLET_OF',
          param: mainOutlet.businessSiteId,
          disabled:
            !selectedOutlet?.marketStructureEnabled ||
            selectedOutletHasSubs ||
            mainOutlet.businessSiteId === selectedOutlet?.businessSiteId ||
            isSubOutletOf(mainOutlet, selectedOutlet)
        });
      });
    }
    return items;
  }
);

export const selectSelectedOutletIndex = createSelector(
  selectSelectedOutlet,
  selectOutlets,
  (selectedOutlet: OutletStructureOutlets, outlets: OutletStructureOutlets[]) => {
    const outletIds: string[] = [];
    outlets.forEach(outlet => {
      outletIds.push(outlet.businessSiteId);
      for (const subOutlet of outlet.subOutlets || []) {
        outletIds.push(subOutlet.businessSiteId);
      }
    });
    return outletIds.findIndex(outletId => outletId === selectedOutlet?.businessSiteId);
  }
);

export const selectInitializedState = createSelector(
  selectSelectedOutlet,
  selectIsLoadingErrorState,
  (selectedOutlet: OutletStructureOutlets, isLoadingFailed: boolean, props: any) => {
    return isLoadingFailed === true || selectedOutlet?.businessSiteId === props.outletId;
  }
);

const outletLabelsFor = (outlet: OutletStructureOutlets): string[] => {
  const labels: string[] = [];
  if (outlet) {
    if (outlet.registeredOffice) {
      labels.push('RO_LABEL');
    }
    if (outlet.mainOutlet) {
      labels.push('MAIN_LABEL');
    }
    if (outlet.subOutlet) {
      labels.push('SUB_LABEL');
    }
    if (!outlet.active) {
      labels.push('INACTIVE');
    }
  }
  return labels;
};

const distributionLevelLabelsFor = (
  outlet: OutletStructureOutlets,
  overwritingDistributionLevels?: string[]
): string[] => {
  let labels: string[] = [];
  const distributionLevels = overwritingDistributionLevels ?? outlet?.distributionLevels;
  if (distributionLevels) {
    labels = distributionLevels.map(
      distributionLevel => 'DISTRIBUTION_LEVEL_' + distributionLevel + '_LABEL'
    );
  }
  return labels;
};

const transform = (node: OutletStructureOutlets) => {
  return {
    expandable: false,
    subOutlet: false,
    lastOutlet: false,
    active: !!node.active,
    businessSiteId: node.businessSiteId,
    city: node.city,
    countryId: node.countryId,
    outletTags: outletLabelsFor(node),
    brandCodes: node.brandCodes,
    businessNames: node.businessNames
  } as FlatStructureNode;
};

const distributionLevelsOf = (
  outlet: OutletStructureOutlets,
  selectedOutlet: OutletStructureOutlets
) =>
  outlet.businessSiteId === selectedOutlet?.businessSiteId
    ? selectedOutlet?.distributionLevels
    : undefined;

export const selectAllFlattenOutlets = createSelector(
  selectOutlets,
  selectSelectedOutlet,
  (outlets: OutletStructureOutlets[], selectedOutlet: OutletStructureOutlets) => {
    return outlets.reduce((flattenOutlets, outlet) => {
      const distributionLevels = distributionLevelsOf(outlet, selectedOutlet);
      const distributionLevelTags = distributionLevelLabelsFor(outlet, distributionLevels);
      const flattenOutlet = { ...transform(outlet), distributionLevelTags };
      flattenOutlets.push(flattenOutlet);

      const flattenSubOutlets = (outlet.subOutlets || []).reduce((subOutlets, subOutlet) => {
        const subDistLevels = distributionLevelsOf(subOutlet, selectedOutlet);
        const subDistLevelsTags = distributionLevelLabelsFor(subOutlet, subDistLevels);
        subOutlets.push({
          ...transform(subOutlet),
          distributionLevelTags: subDistLevelsTags,
          subOutlet: true
        });

        return subOutlets;
      }, [] as FlatStructureNode[]);

      const subOutletCount = flattenSubOutlets.length;
      if (subOutletCount > 0) {
        flattenOutlet.expandable = true;
        flattenSubOutlets[subOutletCount - 1].lastOutlet = true;
        flattenOutlets = flattenOutlets.concat(flattenSubOutlets);
      }

      return flattenOutlets;
    }, [] as FlatStructureNode[]);
  }
);

export const selectActiveFlattenOutlets = createSelector(
  selectOutlets,
  selectSelectedOutlet,
  (outlets: OutletStructureOutlets[], selectedOutlet: OutletStructureOutlets) => {
    return outlets.reduce((flattenOutlets, outlet) => {
      let subOutletSelected = false;
      const flattenSubOutlets = (outlet.subOutlets || []).reduce((subOutlets, subOutlet) => {
        const subDistLevels = distributionLevelsOf(subOutlet, selectedOutlet);
        const subDistLevelsTags = distributionLevelLabelsFor(subOutlet, subDistLevels);
        const isSelected = subOutlet.businessSiteId === selectedOutlet?.businessSiteId;
        subOutletSelected = isSelected ? true : subOutletSelected;

        if (subOutlet.active || isSelected) {
          subOutlets.push({
            ...transform(subOutlet),
            distributionLevelTags: subDistLevelsTags,
            subOutlet: true
          });
        }

        return subOutlets;
      }, [] as FlatStructureNode[]);

      const distributionLevels = distributionLevelsOf(outlet, selectedOutlet);
      const distributionLevelTags = distributionLevelLabelsFor(outlet, distributionLevels);
      const flattenOutlet = { ...transform(outlet), distributionLevelTags };
      const outletSelected = outlet.businessSiteId === selectedOutlet?.businessSiteId;

      if (flattenOutlet.active || outletSelected || subOutletSelected) {
        flattenOutlets.push(flattenOutlet);

        const subOutletCount = flattenSubOutlets.length;
        if (subOutletCount > 0) {
          flattenOutlet.expandable = true;
          flattenSubOutlets[subOutletCount - 1].lastOutlet = true;
          flattenOutlets = flattenOutlets.concat(flattenSubOutlets);
        }
      }

      return flattenOutlets;
    }, [] as FlatStructureNode[]);
  }
);
