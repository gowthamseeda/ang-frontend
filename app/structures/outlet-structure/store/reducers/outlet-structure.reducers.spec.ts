import { Company } from '../../model/company.model';
import { getCompanyDaimlerAG } from '../../model/company.mock';
import { getOutletStructureWith_OneMainHaving_TwoSublets } from '../../model/outlet-structure.mock';
import { OutletStructureActions } from '../actions';

import * as fromOutletStructure from './outlet-structure.reducers';

describe('Outlet Structure Reducers', () => {
  const mockedCompany: Company = getCompanyDaimlerAG();
  const mockedOutletStructure = getOutletStructureWith_OneMainHaving_TwoSublets();

  describe('undefined action', () => {
    test('should return default state', () => {
      const action: any = {};
      const state = fromOutletStructure.reducer(undefined, action);
      expect(state).toEqual(fromOutletStructure.initialState);
    });
  });

  describe('loadOutletStructureSuccess', () => {
    test('returns unchanged outlet structure as state', () => {
      const expectedState = mockedOutletStructure;
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: 'some_outlet_id'
      });
      const state = fromOutletStructure.reducer(fromOutletStructure.initialState, action);
      expect(state).toEqual(expectedState);
    });
  });
});
