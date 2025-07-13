import {
  getMainOutletWith_Sublets,
  getSubOutlet_GS000100,
  getSubOutlet_GS000101,
  getSubOutlet_GS000102,
  getSubOutlet_GS000103
} from '../../model/outlet-structure.mock';
import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import { initialState as initialStateSelectedOutlet } from '../reducers/outlet-structure-selected.reducers';

import {
  selectActiveFlattenOutlets,
  selectAllFlattenOutlets,
  selectInitializedState
} from './extended.selectors';

describe('Extended Selectors Test Suite', () => {
  const sublet100: OutletStructureOutlets = getSubOutlet_GS000100();
  const sublet101: OutletStructureOutlets = getSubOutlet_GS000101();
  const sublet102: OutletStructureOutlets = getSubOutlet_GS000102();
  const sublet103: OutletStructureOutlets = getSubOutlet_GS000103();
  const mainWithSub100: OutletStructureOutlets = getMainOutletWith_Sublets([sublet100]);
  const mainWithSub103: OutletStructureOutlets = getMainOutletWith_Sublets(
    [sublet103],
    'GS0000461'
  );
  const outletsState: OutletStructureOutlets[] = [
    mainWithSub100,
    sublet101,
    sublet102,
    mainWithSub103
  ];

  describe('selectInitializedState', () => {
    const outletId = 'GS1234567';
    test('should return true if outlet-id is in store, matches given outlet-id and loading status in store contains no error', () => {
      const selectedOutletState = {
        initialStateSelectedOutlet,
        businessSiteId: outletId
      };
      const isLoadingErrorState = false;

      const selection = selectInitializedState.projector((selectedOutletState as any), isLoadingErrorState, {
        outletId: outletId
      });
      expect(selection).toBe(true);
    });

    test('should return true if loading status in store contains an error', () => {
      const isLoadingErrorState = true;

      const selection = selectInitializedState.projector(undefined, isLoadingErrorState, {
        outletId: outletId
      });
      expect(selection).toBe(true);
    });

    test('should return false if outlet-id is not in store and loading status in store contains no error', () => {
      const selectedOutletState = { initialStateSelectedOutlet };
      const isLoadingErrorState = false;

      const selection = selectInitializedState.projector((selectedOutletState as any), isLoadingErrorState, {
        outletId: outletId
      });
      expect(selection).toBe(false);
    });
  });

  describe('selectActiveFlattenOutlets', () => {
    beforeEach(() => {
      mainWithSub100.active = false;
      sublet100.active = false;
      sublet101.active = false;
      sublet102.active = false;
      mainWithSub103.active = false;
      sublet103.active = false;
    });

    test('should return only inactive main outlet', () => {
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...mainWithSub100 });
      expect(selection.length).toBe(1);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
    });

    test('should return only inactive outlet', () => {
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...sublet102 });
      expect(selection.length).toBe(1);
      expect(selection[0].businessSiteId).toBe(sublet102.businessSiteId);
    });

    test('should return only inactive sub outlet and its active main outlet', () => {
      mainWithSub100.active = true;
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...sublet100 });

      expect(selection.length).toBe(2);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
    });

    test('should return only inactive sub outlet and its inactive main outlet', () => {
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...sublet100 });

      expect(selection.length).toBe(2);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
    });

    test('should return only active outlets exluding main outlets', () => {
      sublet101.active = true;
      sublet102.active = true;
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...sublet102 });

      expect(selection.length).toBe(2);
      expect(selection[0].businessSiteId).toBe(sublet101.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet102.businessSiteId);
    });

    test('should return only active outlets including main outlets', () => {
      mainWithSub100.active = true;
      sublet100.active = true;
      mainWithSub103.active = true;
      sublet103.active = true;
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...sublet100 });

      expect(selection.length).toBe(4);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
      expect(selection[2].businessSiteId).toBe(mainWithSub103.businessSiteId);
      expect(selection[3].businessSiteId).toBe(sublet103.businessSiteId);
    });

    test('should return only active main outlet', () => {
      mainWithSub100.active = true;
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...mainWithSub100 });

      expect(selection.length).toBe(1);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
    });

    test('should return all outlets as they are all active', () => {
      mainWithSub100.active = true;
      sublet100.active = true;
      sublet101.active = true;
      sublet102.active = true;
      mainWithSub103.active = true;
      sublet103.active = true;
      const selection = selectActiveFlattenOutlets.projector(outletsState, { ...sublet103 });

      expect(selection.length).toBe(6);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
      expect(selection[2].businessSiteId).toBe(sublet101.businessSiteId);
      expect(selection[3].businessSiteId).toBe(sublet102.businessSiteId);
      expect(selection[4].businessSiteId).toBe(mainWithSub103.businessSiteId);
      expect(selection[5].businessSiteId).toBe(sublet103.businessSiteId);
    });
  });

  describe('selectAllFlattenOutlets', () => {
    test('should return all outlets when they are all inactive', () => {
      mainWithSub100.active = false;
      sublet100.active = false;
      sublet101.active = false;
      sublet102.active = false;
      mainWithSub103.active = false;
      sublet103.active = false;
      const selection = selectAllFlattenOutlets.projector(outletsState, { ...mainWithSub100 });

      expect(selection.length).toBe(6);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
      expect(selection[2].businessSiteId).toBe(sublet101.businessSiteId);
      expect(selection[3].businessSiteId).toBe(sublet102.businessSiteId);
      expect(selection[4].businessSiteId).toBe(mainWithSub103.businessSiteId);
      expect(selection[5].businessSiteId).toBe(sublet103.businessSiteId);
    });

    test('should return all outlets when they are all active', () => {
      const selection = selectAllFlattenOutlets.projector(outletsState, { ...mainWithSub100 });

      expect(selection.length).toBe(6);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
      expect(selection[2].businessSiteId).toBe(sublet101.businessSiteId);
      expect(selection[3].businessSiteId).toBe(sublet102.businessSiteId);
      expect(selection[4].businessSiteId).toBe(mainWithSub103.businessSiteId);
      expect(selection[5].businessSiteId).toBe(sublet103.businessSiteId);
    });

    test('should return all outlets when they are partially active', () => {
      sublet100.active = false;
      sublet102.active = false;
      const selection = selectAllFlattenOutlets.projector(outletsState, { ...sublet103 });

      expect(selection.length).toBe(6);
      expect(selection[0].businessSiteId).toBe(mainWithSub100.businessSiteId);
      expect(selection[1].businessSiteId).toBe(sublet100.businessSiteId);
      expect(selection[2].businessSiteId).toBe(sublet101.businessSiteId);
      expect(selection[3].businessSiteId).toBe(sublet102.businessSiteId);
      expect(selection[4].businessSiteId).toBe(mainWithSub103.businessSiteId);
      expect(selection[5].businessSiteId).toBe(sublet103.businessSiteId);
    });

    test('should overwrite distribution levels from selected outlet but only for selected outlet', () => {
      const selectedOutletState = { ...sublet100 };
      const selection = selectAllFlattenOutlets.projector(outletsState, selectedOutletState);

      const selectedFlatNode = selection.find(
        node => node.businessSiteId === selectedOutletState.businessSiteId
      );
      expect(selectedFlatNode).toBeTruthy();
      if (selectedFlatNode) {
        expect(selectedFlatNode.distributionLevelTags).toEqual(
          selectedOutletState.distributionLevels?.map(dl => 'DISTRIBUTION_LEVEL_' + dl + '_LABEL')
        );
      }
    });

    test('should not change distribution levels from not selected outlets', () => {
      const notSelectedNodes: any = [
        {
          businessSiteId: mainWithSub100.businessSiteId,
          distributionLevels: mainWithSub100.distributionLevels
        },
        {
          businessSiteId: sublet100.businessSiteId,
          distributionLevels: sublet100.distributionLevels
        }
      ];
      const selectedOutletState = { ...sublet100 };
      const selection = selectAllFlattenOutlets.projector(outletsState, selectedOutletState);

      notSelectedNodes.forEach(notSelectedNode => {
        const expectedNotSelectedFlatNode = selection.find(
          node => node.businessSiteId === notSelectedNode.businessSiteId
        );
        expect(expectedNotSelectedFlatNode).toBeTruthy();

        if (expectedNotSelectedFlatNode) {
          expect(expectedNotSelectedFlatNode.distributionLevelTags).toEqual(
            notSelectedNode.distributionLevels?.map(dl => 'DISTRIBUTION_LEVEL_' + dl + '_LABEL')
          );
        }
      });
    });
  });
});
