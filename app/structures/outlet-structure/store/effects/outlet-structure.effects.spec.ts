import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { MarketStructureService } from '../../../market-structure/market-structure.service';
import { getCompanyDaimlerAG } from '../../model/company.mock';
import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import { OutletStructureResource } from '../../model/outlet-structure-api.model';
import {
  getMainOutletWith_Sublets,
  getOutletStructureWith_OneMainHaving_TwoSublets,
  getSubOutlet_GS000100,
  getSubOutlet_GS000101
} from '../../model/outlet-structure.mock';
import { OutletStructureApiService } from '../../services/outlet-structure-api.service';
import { OutletStructureService } from '../../services/outlet-structure.service';
import { OutletStructureActions } from '../actions';

import { OutletStructureEffects } from './outlet-structure.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('Outlet Structure Effects', () => {
  let effects: OutletStructureEffects;
  let marketStructureService: MarketStructureService;
  let outletStructureService: OutletStructureApiService;
  let structureStoreService: OutletStructureService;
  let actions: Observable<any>;

  const company = getCompanyDaimlerAG();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OutletStructureEffects,
        provideMockActions(() => actions),
        {
          provide: OutletStructureApiService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: MarketStructureService,
          useValue: {
            update: jest.fn(),
            create: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: SnackBarService,
          useValue: {
            showInfo: jest.fn()
          }
        },
        {
          provide: OutletStructureApiService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: OutletStructureService,
          useValue: {
            getSiblingOutletIds: jest.fn()
          }
        },
        {
          provide: SnackBarService,
          useValue: {
            showInfo: jest.fn(),
            showError: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(OutletStructureEffects);
    marketStructureService = TestBed.inject(MarketStructureService);
    outletStructureService = TestBed.inject(OutletStructureApiService);
    structureStoreService = TestBed.inject(OutletStructureService);
    actions = TestBed.inject(Actions);
  });

  describe('loadOutletStructure', () => {
    test('should return loadOutletStructureSuccess action', () => {
      const outletStructure = getOutletStructureWith_OneMainHaving_TwoSublets();
      const outletId = outletStructure.outlets[0].businessSiteId;
      const outletStructureResult: OutletStructureResource = {
        companyLegalName: company.legalName,
        companyCity: company.city,
        companyId: company.id,
        outlets: outletStructure.outlets
      };
      const loadOutletStructuresAction = OutletStructureActions.loadOutletStructures({
        outletId: outletId
      });
      const successAction = OutletStructureActions.loadOutletStructureSuccess({
        company,
        outletStructure,
        outletId
      });

      actions = hot('                     a', { a: loadOutletStructuresAction });
      const structuresApiResponse = cold('-b|', { b: outletStructureResult });
      const expected = cold('             -c', { c: successAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(structuresApiResponse);

      expect(effects.loadOutletStructure).toBeObservable(expected);
    });

    test('should return a loadOutletStructureFailure action if loading failed', () => {
      const outletId = 'some_id';
      const loadOutletStructuresAction = OutletStructureActions.loadOutletStructures({
        outletId: outletId
      });
      const error = new Error('some error') as any;
      const failureAction = OutletStructureActions.loadOutletStructureFailure({ error });

      actions = hot('                      -a', { a: loadOutletStructuresAction });
      const structuresApiResponse = cold(' -#|', {}, error);
      const expected = cold('              --(c|)', { c: failureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(structuresApiResponse);

      expect(effects.loadOutletStructure).toBeObservable(expected);
    });
  });

  describe('removeSublets', () => {
    test('should return loadOutletStructures-Action with outlet id from given Outlet', () => {
      const removeSubletsAction = OutletStructureActions.removeSublets({ outletId: '123456' });
      const updateResult = { id: '123', status: 'UPDATED' };
      const loadOutletStructureAction = OutletStructureActions.loadOutletStructures({
        outletId: '123456'
      });

      actions = hot('                          -a', { a: removeSubletsAction });
      const marketStructureApiResponse = cold('-b|', { b: updateResult });
      const expected = cold('                  ---c', { c: loadOutletStructureAction });

      jest.spyOn(marketStructureService, 'update').mockReturnValue(marketStructureApiResponse);

      expect(effects.removeSublets).toBeObservable(expected);
    });
  });

  describe('createMarketStructure', () => {
    test('should make outlet to main outlet', () => {
      const outletId = 'GS1234562';
      const createResult = { id: '1', status: 'CREATED' };
      const createMarketStructureAction = OutletStructureActions.createMarketStructure({
        marketStructure: { mainBusinessSiteId: outletId, subBusinessSiteIds: [] },
        sourceOutlet: { isSublet: false, siblingOutletIds: [], sourceParentId: '' }
      });
      const loadOutletStructures = OutletStructureActions.loadOutletStructures({
        outletId: outletId
      });

      actions = hot('                                -a', { a: createMarketStructureAction });
      const createMarketStructureApiResponse = cold('-a|', { a: createResult });
      const expected = cold('                        ---b', { b: loadOutletStructures });

      jest
        .spyOn(marketStructureService, 'create')
        .mockReturnValue(createMarketStructureApiResponse);

      expect(effects.createMarketStructure).toBeObservable(expected);
    });
  });

  describe('moveSubletTo', () => {
    test('should move a sublet having siblings to a main outlet without siblings', () => {
      const sourceSublet: OutletStructureOutlets = getSubOutlet_GS000100();
      const sourceStructure: OutletStructureOutlets = getMainOutletWith_Sublets([sourceSublet]);
      const targetOutletId = 'GS00T001';
      const targetStructure: OutletStructureOutlets = getMainOutletWith_Sublets([], targetOutletId);
      const triggerAction = OutletStructureActions.moveSubletTo({
        sourceOutlet: sourceSublet,
        sourceParentId: sourceStructure.businessSiteId,
        siblingOutletIds: sourceStructure.subOutlets
          ? sourceStructure.subOutlets.map(sublet => sublet.businessSiteId)
          : [],
        targetOutletId: targetOutletId,
        targetSubletIds: targetStructure.subOutlets
          ? targetStructure.subOutlets.map(sublet => sublet.businessSiteId)
          : []
      });
      const expectedAction = OutletStructureActions.loadOutletStructures({
        outletId: sourceSublet.businessSiteId
      });
      const updateResult = { id: '1', status: 'UPDATED' };

      actions = hot('                                -a', { a: triggerAction });
      const marketStructureUpdateApiResponse = cold('-b|', { b: updateResult });
      const expected = cold('                        -----c', { c: expectedAction });

      jest
        .spyOn(marketStructureService, 'update')
        .mockReturnValue(marketStructureUpdateApiResponse);

      expect(effects.moveSubletTo).toBeObservable(expected);
    });

    test('should return a moveSubletToFailure Action if marketStructure.update returns an error', () => {
      const error = new Error('some error') as any;
      const failureAction = OutletStructureActions.moveSubletToFailure({ error });
      const triggerAction = OutletStructureActions.moveSubletTo({
        sourceOutlet: getSubOutlet_GS000100(),
        sourceParentId: 'anyParentId',
        siblingOutletIds: [],
        targetOutletId: 'anyTargetId',
        targetSubletIds: []
      });

      actions = hot('                                 -a', { a: triggerAction });
      const marketStructureUpdateApiResponse = cold(' -#|', {}, error);
      const expected = cold('                         --(b|)', { b: failureAction });

      jest
        .spyOn(marketStructureService, 'update')
        .mockReturnValue(marketStructureUpdateApiResponse);

      expect(effects.moveSubletTo).toBeObservable(expected);
    });
  });

  describe('deleteFromMarketStructure', () => {
    test('should return loadOutletStructures action with outletId of sublet when sublet was detached successfully.', () => {
      const firstSublet = getSubOutlet_GS000100();
      const subletId = firstSublet.businessSiteId;
      const secondSublet = getSubOutlet_GS000101();
      const mainOutlet = getMainOutletWith_Sublets([firstSublet, secondSublet]);
      const outletStructureApiResult: OutletStructureResource = {
        companyLegalName: company.legalName,
        companyCity: company.city,
        companyId: company.id,
        outlets: [mainOutlet]
      };
      const structureStoreResult = [firstSublet.businessSiteId, secondSublet.businessSiteId];
      const detachSubletAction = OutletStructureActions.deleteFromMarketStructure({
        outletId: subletId,
        mainOutlet: false,
        subOutlet: true
      });
      const loadOutletStructureAction = OutletStructureActions.loadOutletStructures({
        outletId: subletId
      });
      const updateApiResult = { id: mainOutlet.businessSiteId, status: 'UPDATED' };

      actions = hot('                             -a', { a: detachSubletAction });
      const outletStructureGetResponse = cold('   -b|', { b: outletStructureApiResult });
      const structureStoreGetResponse = cold('    --c|', { c: structureStoreResult });
      const marketStructureUpdateResponse = cold('---d|', { d: updateApiResult });
      const expected = cold('                     -------e', { e: loadOutletStructureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(outletStructureGetResponse);
      jest
        .spyOn(structureStoreService, 'getSiblingOutletIds')
        .mockReturnValue(structureStoreGetResponse);
      jest.spyOn(marketStructureService, 'update').mockReturnValue(marketStructureUpdateResponse);

      expect(effects.deleteFromMarketStructure).toBeObservable(expected);
    });

    test('should return loadOutletStructures action with main outlet id when main outlet was detached successfully.', () => {
      const sublet = getSubOutlet_GS000100();
      const mainOutlet = getMainOutletWith_Sublets([sublet]);
      const structureStoreResult = [sublet.businessSiteId];
      const outletStructureResult: OutletStructureResource = {
        companyLegalName: company.legalName,
        companyCity: company.city,
        companyId: company.id,
        outlets: [mainOutlet]
      };
      const deleteApiResult = { id: mainOutlet.businessSiteId, status: 'UPDATED' };

      const detachOutletAction = OutletStructureActions.deleteFromMarketStructure({
        outletId: mainOutlet.businessSiteId,
        mainOutlet: true,
        subOutlet: false
      });
      const loadOutletStructureAction = OutletStructureActions.loadOutletStructures({
        outletId: mainOutlet.businessSiteId
      });

      actions = hot('                             -a', { a: detachOutletAction });
      const outletStructureGetResponse = cold('   -b|', { b: outletStructureResult });
      const structureStoreGetResponse = cold('    -c|', { c: structureStoreResult });
      const marketStructureDeleteResponse = cold('--d|', { d: deleteApiResult });
      const expected = cold('                     ------e', { e: loadOutletStructureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(outletStructureGetResponse);
      jest
        .spyOn(structureStoreService, 'getSiblingOutletIds')
        .mockReturnValue(structureStoreGetResponse);
      jest.spyOn(marketStructureService, 'delete').mockReturnValue(marketStructureDeleteResponse);

      expect(effects.deleteFromMarketStructure).toBeObservable(expected);
    });

    test('should return loadOutletStructures action when no outlet was detached.', () => {
      const someOutletId = 'someOutletId';
      const firstSublet = getSubOutlet_GS000100();
      const secondSublet = getSubOutlet_GS000101();
      const mainOutlet = getMainOutletWith_Sublets([firstSublet, secondSublet]);
      const structureStoreResult = [firstSublet.businessSiteId, secondSublet.businessSiteId];
      const outletStructureResult: OutletStructureResource = {
        companyLegalName: company.legalName,
        companyCity: company.city,
        companyId: company.id,
        outlets: [mainOutlet]
      };

      const detachOutletAction = OutletStructureActions.deleteFromMarketStructure({
        outletId: someOutletId,
        mainOutlet: false,
        subOutlet: false
      });
      const loadOutletStructureAction = OutletStructureActions.loadOutletStructures({
        outletId: someOutletId
      });

      actions = hot('                          -a', { a: detachOutletAction });
      const outletStructureGetResponse = cold('-b|', { b: outletStructureResult });
      const structureStoreGetResponse = cold(' -c|', { c: structureStoreResult });
      const expected = cold('                  ---d', { d: loadOutletStructureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(outletStructureGetResponse);
      jest
        .spyOn(structureStoreService, 'getSiblingOutletIds')
        .mockReturnValue(structureStoreGetResponse);

      expect(effects.deleteFromMarketStructure).toBeObservable(expected);
    });

    test('should return deleteFromMarketStructureFailure when loading outlet structure failed.', () => {
      const someOutletId = 'someOutletId';
      const error = new Error('some error') as any;
      const failureAction = OutletStructureActions.deleteFromMarketStructureFailure({ error });
      const detachOutletAction = OutletStructureActions.deleteFromMarketStructure({
        outletId: someOutletId,
        mainOutlet: true,
        subOutlet: false
      });

      actions = hot('                          -a', { a: detachOutletAction });
      const outletStructureGetResponse = cold('--#|', {}, error);
      const structureStoreGetResponse = cold(' --b|', { b: ['any_SiblingId'] });
      const expected = cold('                  ---(c|)', { c: failureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(outletStructureGetResponse);
      jest
        .spyOn(structureStoreService, 'getSiblingOutletIds')
        .mockReturnValue(structureStoreGetResponse);

      expect(effects.deleteFromMarketStructure).toBeObservable(expected);
    });

    test('should return deleteFromMarketStructureFailure when detaching main outlet failed.', () => {
      const mainOutletId = 'any_MainOutletId';
      const firstSublet = getSubOutlet_GS000100();
      const secondSublet = getSubOutlet_GS000101();
      const mainOutlet = getMainOutletWith_Sublets([firstSublet, secondSublet]);
      const structureStoreResult = [firstSublet.businessSiteId, secondSublet.businessSiteId];
      const outletStructureResult: OutletStructureResource = {
        companyLegalName: company.legalName,
        companyCity: company.city,
        companyId: company.id,
        outlets: [mainOutlet]
      };

      const error = new Error('some error') as any;
      const failureAction = OutletStructureActions.deleteFromMarketStructureFailure({ error });
      const detachOutletAction = OutletStructureActions.deleteFromMarketStructure({
        outletId: mainOutletId,
        mainOutlet: true,
        subOutlet: false
      });

      actions = hot('                             -a', { a: detachOutletAction });
      const outletStructureGetResponse = cold('   -b|', { b: outletStructureResult });
      const structureStoreGetResponse = cold('    -b|', { b: structureStoreResult });
      const marketStructureDeleteResponse = cold('--#|', {}, error);
      const expected = cold('                     -----(c|)', { c: failureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(outletStructureGetResponse);
      jest.spyOn(marketStructureService, 'delete').mockReturnValue(marketStructureDeleteResponse);
      jest
        .spyOn(structureStoreService, 'getSiblingOutletIds')
        .mockReturnValue(structureStoreGetResponse);

      expect(effects.deleteFromMarketStructure).toBeObservable(expected);
    });

    test('should return deleteFromMarketStructureFailure when detaching sublet failed.', () => {
      const firstSublet = getSubOutlet_GS000100();
      const secondSublet = getSubOutlet_GS000101();
      const mainOutlet = getMainOutletWith_Sublets([firstSublet, secondSublet]);
      const structureStoreResult = [firstSublet.businessSiteId, secondSublet.businessSiteId];
      const outletStructureResource: OutletStructureResource = {
        companyLegalName: company.legalName,
        companyCity: company.city,
        companyId: company.id,
        outlets: [mainOutlet]
      };

      const error = new Error('some error') as any;
      const failureAction = OutletStructureActions.deleteFromMarketStructureFailure({ error });
      const detachSubletAction = OutletStructureActions.deleteFromMarketStructure({
        outletId: secondSublet.businessSiteId,
        mainOutlet: false,
        subOutlet: true
      });

      actions = hot('                             -a', { a: detachSubletAction });
      const outletStructureGetResponse = cold('   -b|', { b: outletStructureResource });
      const structureStoreGetResponse = cold('    -b|', { b: structureStoreResult });
      const marketStructureUpdateResponse = cold('--#|', {}, error);
      const expected = cold('                     -----(c|)', { c: failureAction });

      jest.spyOn(outletStructureService, 'get').mockReturnValue(outletStructureGetResponse);
      jest
        .spyOn(structureStoreService, 'getSiblingOutletIds')
        .mockReturnValue(structureStoreGetResponse);
      jest.spyOn(marketStructureService, 'update').mockReturnValue(marketStructureUpdateResponse);

      expect(effects.deleteFromMarketStructure).toBeObservable(expected);
    });
  });
});
