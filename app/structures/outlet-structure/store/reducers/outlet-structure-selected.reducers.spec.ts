import { getCompanyDaimlerAG } from '../../model/company.mock';
import { Company } from '../../model/company.model';
import {
  getMainOutletWith_Sublets,
  getSubOutlet_GS000100,
  getSubOutlet_GS000101
} from '../../model/outlet-structure.mock';
import { OutletStructure, OutletStructureOutlets } from '../../model/outlet-structure.model';
import { DistributionLevelActions, OutletStructureActions } from '../actions';

import * as fromSelectedOutlet from './outlet-structure-selected.reducers';

describe('Selected Outlet Reducers', () => {
  const mockedCompany: Company = getCompanyDaimlerAG();
  const mockFirstSublet = getSubOutlet_GS000100();
  const mockSecondSublet = getSubOutlet_GS000101();
  const mainOutlet = getMainOutletWith_Sublets([mockFirstSublet, mockSecondSublet]);
  const mockedOutletStructure: OutletStructure = {
    outlets: [mainOutlet]
  };

  describe('undefined action', () => {
    test('should return default state', () => {
      const action: any = {};
      const state = fromSelectedOutlet.reducer(undefined, action);
      expect(state).toEqual(fromSelectedOutlet.initialState);
    });
  });

  describe('loadOutletStructureSuccess', () => {
    test('returns correct outlet being main as selected outlet state, but without changing distribution levels', () => {
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: mainOutlet.businessSiteId
      });
      const expectedState = { ...mainOutlet, distributionLevels: [] };
      const state = fromSelectedOutlet.reducer(fromSelectedOutlet.initialState, action);
      expect(state).toEqual(expectedState);
    });

    test('returns correct outlet being sub as selected outlet state, but without changing distribution levels', () => {
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: mockFirstSublet.businessSiteId
      });
      const stateBefore = mockSecondSublet;
      const expectedState = {
        ...mockFirstSublet,
        distributionLevels: mockSecondSublet.distributionLevels
      };
      const state = fromSelectedOutlet.reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });

    test('returns initial state if no outlet found', () => {
      const beforeState = mainOutlet;
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: 'some_outlet_id'
      });
      const state = fromSelectedOutlet.reducer(beforeState, action);
      expect(state).toEqual(fromSelectedOutlet.initialState);
    });
  });

  describe('loadDistributionLevelSuccess', () => {
    const distributionLevelsMock: string[] = ['RETAILER', 'WHOLESALER'];

    test('should overwrite distribution level information on success', () => {
      const beforeState = mainOutlet;
      const action = DistributionLevelActions.loadDistributionLevelSuccess({
        distributionLevels: distributionLevelsMock
      });

      const state = fromSelectedOutlet.reducer(beforeState, action);
      const expected: OutletStructureOutlets = {
        ...mainOutlet,
        distributionLevels: distributionLevelsMock
      };
      expect(state).toEqual(expected);
    });

    test('should reset distribution level information on failure', () => {
      const beforeState = mainOutlet;
      const action = DistributionLevelActions.loadDistributionLevelFailure({
        error: { message: 'any_error' }
      });

      const state = fromSelectedOutlet.reducer(beforeState, action);
      const expected: OutletStructureOutlets = {
        ...mainOutlet,
        distributionLevels: []
      };
      expect(state).toEqual(expected);
    });
  });
});
