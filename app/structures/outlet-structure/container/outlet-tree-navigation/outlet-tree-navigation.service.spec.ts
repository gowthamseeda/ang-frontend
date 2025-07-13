import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OutletStructureService } from '../../services/outlet-structure.service';
import { OutletStructureActionService } from '../../services/outlet-structure-action.service';
import { OutletTreeNavigationService } from './outlet-tree-navigation.service';
import { getSubOutlet_GS000100 } from '../../model/outlet-structure.mock';

describe('OutletTreeNavigationService Suite', () => {
  let outletTreeNavigationService: OutletTreeNavigationService;
  let structuresStoreService: OutletStructureService;
  let structuresActionService: OutletStructureActionService;

  const outletId = 'GS1235';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OutletStructureService,
          useValue: {
            getSiblingOutletIds: jest.fn(),
            getSubletParentId: jest.fn(),
            getSubletIds: jest.fn()
          }
        },
        {
          provide: OutletStructureActionService,
          useValue: {
            dispatchCreateMarketStructure: jest.fn(),
            dispatchRemoveAllSublets: jest.fn(),
            dispatchRemoveOutletFromMarketStructure: jest.fn(),
            dispatchMoveSubletTo: jest.fn()
          }
        }
      ]
    });

    structuresStoreService = TestBed.inject(OutletStructureService);
    structuresActionService = TestBed.inject(OutletStructureActionService);
    outletTreeNavigationService = new OutletTreeNavigationService(
      structuresStoreService,
      structuresActionService
    );
  });

  describe('createMarketStructureForOutlet should', () => {
    const siblingOutletIds: string[] = [outletId, 'GS123', 'GS456'];
    const subletParentId = 'GS001';
    const isSublet = true;

    beforeEach(() => {
      jest
        .spyOn(structuresStoreService, 'getSiblingOutletIds')
        .mockReturnValue(of(siblingOutletIds));
      jest.spyOn(structuresStoreService, 'getSubletParentId').mockReturnValue(of(subletParentId));
      jest.spyOn(structuresActionService, 'dispatchCreateMarketStructure');
    });

    test('call structuresActionService.dispatchCreateMarketStructure with filtered siblings', () => {
      const expectedCombinedData = {
        siblingOutletIds: siblingOutletIds.slice(1),
        sourceParentId: subletParentId
      };
      outletTreeNavigationService.createMarketStructureForOutlet(outletId, isSublet);

      expect(structuresActionService.dispatchCreateMarketStructure).toHaveBeenCalledWith(
        outletId,
        isSublet,
        expectedCombinedData
      );
    });
  });

  describe('removeAllSubletsFromMarketStructure should', () => {
    test('call structuresActionService.dispatchRemoveAllSublets with given outlet id', () => {
      jest.spyOn(structuresActionService, 'dispatchRemoveAllSublets');
      outletTreeNavigationService.removeAllSubletsFromMarketStructure(outletId);

      expect(structuresActionService.dispatchRemoveAllSublets).toHaveBeenCalledWith(outletId);
    });
  });

  describe('removeOutletFromMarketStructure should', () => {
    test('call structuresActionService.dispatchRemoveOutletFromMarketStructure with given params', () => {
      jest.spyOn(structuresActionService, 'dispatchRemoveOutletFromMarketStructure');
      outletTreeNavigationService.removeOutletFromMarketStructure(outletId, true, true);

      expect(structuresActionService.dispatchRemoveOutletFromMarketStructure).toHaveBeenCalledWith(
        outletId,
        true,
        true
      );
    });
  });

  describe('makeOutletSubletOf should', () => {
    const sourceSublet = getSubOutlet_GS000100();
    const siblingOutletIds: string[] = [sourceSublet.businessSiteId, 'GS123', 'GS456'];
    const subletParentId = 'GP1235';
    const targetOutletId = 'GT9999';
    const targetsSubletIds: string[] = ['GS000'];

    beforeEach(() => {
      jest
        .spyOn(structuresStoreService, 'getSiblingOutletIds')
        .mockReturnValue(of(siblingOutletIds));
      jest.spyOn(structuresStoreService, 'getSubletParentId').mockReturnValue(of(subletParentId));
      jest.spyOn(structuresStoreService, 'getSubletIds').mockReturnValue(of(targetsSubletIds));
      jest.spyOn(structuresActionService, 'dispatchMoveSubletTo');
    });

    test('call structuresActionService.makeOutletSubletOf', () => {
      outletTreeNavigationService.makeOutletSubletOf(sourceSublet, targetOutletId);

      expect(structuresActionService.dispatchMoveSubletTo).toHaveBeenCalledWith(
        targetOutletId,
        sourceSublet,
        siblingOutletIds.slice(1),
        targetsSubletIds,
        subletParentId
      );
    });
  });
});
