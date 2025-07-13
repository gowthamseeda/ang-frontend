import { getInitialStructuresState } from '../../../store/state.mock';
import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import {
  getMainOutletWith_Sublets,
  getOutletStructureWith_OneMainHaving_TwoSublets,
  getSubOutlet_GS000100,
  getSubOutlet_GS000101,
  getSubOutlet_GS000102
} from '../../model/outlet-structure.mock';
import * as fromOutletStructure from '../reducers/outlet-structure.reducers';

import {
  selectMainOutlets,
  selectOutlets,
  selectSiblingOutletIds,
  selectStructure,
  selectSubletIds,
  selectSubletParentId,
  structureOutletsContainAtLeastOneMainOutlet
} from './outlet-structure.selectors';

describe('OutletStructure Selectors Test Suite', () => {
  const initialStructuresState = getInitialStructuresState();
  const sublet100 = getSubOutlet_GS000100();
  const sublet101 = getSubOutlet_GS000101();
  const sublet102 = getSubOutlet_GS000102();

  describe('selectStructure', () => {
    const initialOutletStructureState = initialStructuresState.outletStructure;
    test('returns correct node from store slice', () => {
      const selection = selectStructure.projector(initialOutletStructureState);

      expect(selection).toStrictEqual(fromOutletStructure.initialState);
    });
  });

  describe('selectOutlets', () => {
    test('should return empty array if initial store', () => {
      const outletStructureState = initialStructuresState.outletStructure.structure;
      const selection = selectOutlets.projector(outletStructureState);

      expect(selection).toStrictEqual([]);
    });

    test('should return all outlets unchanged', () => {
      const outletStructureState = getOutletStructureWith_OneMainHaving_TwoSublets();
      const selection = selectOutlets.projector(outletStructureState);

      expect(selection).toStrictEqual(outletStructureState.outlets);
    });
  });

  describe('structureOutletsContainAtLeastOneMainOutlet', () => {
    test('should return true if at least one main outlet exists', () => {
      const mainWithSubs = getMainOutletWith_Sublets([sublet100]);
      const outletsState: OutletStructureOutlets[] = [mainWithSubs, sublet101];
      const selection = structureOutletsContainAtLeastOneMainOutlet.projector(outletsState);

      expect(selection).toBe(true);
    });

    test('should return false if no main outlet exists', () => {
      const outletsWithoutMainState: OutletStructureOutlets[] = [sublet100, sublet101];
      const selection = structureOutletsContainAtLeastOneMainOutlet.projector(
        outletsWithoutMainState
      );

      expect(selection).toBe(false);
    });

    test('should return false if no outlet exists', () => {
      const outletsWithoutMainState: OutletStructureOutlets[] = [];
      const selection = structureOutletsContainAtLeastOneMainOutlet.projector(
        outletsWithoutMainState
      );

      expect(selection).toBe(false);
    });
  });

  describe('selectMainOutlets', () => {
    const main_GS01 = getMainOutletWith_Sublets([], 'GS01');
    const main_GS02 = getMainOutletWith_Sublets([], 'GS02');

    test('should return all main outlets only', () => {
      const outletsState: OutletStructureOutlets[] = [sublet100, main_GS01, sublet101, main_GS02];
      const selection = selectMainOutlets.projector(outletsState);

      expect(selection).toStrictEqual([main_GS01, main_GS02]);
    });

    test('should return empty array if no main outlets', () => {
      const outletsState: OutletStructureOutlets[] = [sublet100, sublet101];
      const selection = selectMainOutlets.projector(outletsState);

      expect(selection).toStrictEqual([]);
    });
  });

  describe('selectSiblingOutletIds', () => {
    test('should return all sublet ids of same parent', () => {
      const mainOutlet = getMainOutletWith_Sublets([sublet100, sublet101]);
      const outletsState: OutletStructureOutlets[] = [mainOutlet];
      const expectedIds: string[] = [sublet100.businessSiteId, sublet101.businessSiteId];

      const selection = selectSiblingOutletIds.projector(outletsState, {
        outletId: sublet100.businessSiteId
      });

      expect(selection).toStrictEqual(expectedIds);
    });

    test('should return only one sublet id if there are no other siblings', () => {
      const mainOutlet = getMainOutletWith_Sublets([sublet100]);
      const outletsState: OutletStructureOutlets[] = [mainOutlet];
      const expectedIds: string[] = [sublet100.businessSiteId];

      const selection = selectSiblingOutletIds.projector(outletsState, {
        outletId: sublet100.businessSiteId
      });

      expect(selection).toStrictEqual(expectedIds);
    });

    test('should return empty array if unknown outlet id is requested', () => {
      const mainOutlet = getMainOutletWith_Sublets([sublet100]);
      const outletsState: OutletStructureOutlets[] = [mainOutlet];
      const expectedIds: string[] = [];

      const selection = selectSiblingOutletIds.projector(outletsState, { outletId: 'any_id' });

      expect(selection).toStrictEqual(expectedIds);
    });
  });

  describe('selectSubletIds', () => {
    test('should return all sublet ids of requested outlet', () => {
      const mainOutlet = getMainOutletWith_Sublets([sublet100, sublet101]);
      const otherMainOutlet = getMainOutletWith_Sublets([sublet102], 'GS0099');
      const outletsState: OutletStructureOutlets[] = [mainOutlet, otherMainOutlet];
      const expectedIds: string[] = [sublet100.businessSiteId, sublet101.businessSiteId];

      const selection = selectSubletIds.projector(outletsState, {
        outletId: mainOutlet.businessSiteId
      });

      expect(selection).toStrictEqual(expectedIds);
    });

    test('should return empty array if requested outlet has no sublets', () => {
      const mainOutlet = getMainOutletWith_Sublets([]);
      const outletsState: OutletStructureOutlets[] = [mainOutlet];
      const expectedIds: string[] = [];

      const selection = selectSubletIds.projector(outletsState, {
        outletId: mainOutlet.businessSiteId
      });

      expect(selection).toStrictEqual(expectedIds);
    });

    test('should return empty array if unknown outlet id is requested', () => {
      const mainOutlet = getMainOutletWith_Sublets([sublet100]);
      const outletsState: OutletStructureOutlets[] = [mainOutlet];
      const expectedIds: string[] = [];

      const selection = selectSubletIds.projector(outletsState, { outletId: 'any_id' });

      expect(selection).toStrictEqual(expectedIds);
    });
  });

  describe('selectSubletParentId', () => {
    test('should return outlet id of requested sublet', () => {
      const mainOutlet = getMainOutletWith_Sublets([sublet100, sublet101]);
      const outletsState: OutletStructureOutlets[] = [mainOutlet];

      const selection = selectSubletParentId.projector(outletsState, {
        outletId: sublet101.businessSiteId
      });

      expect(selection).toStrictEqual(mainOutlet.businessSiteId);
    });
  });
});
