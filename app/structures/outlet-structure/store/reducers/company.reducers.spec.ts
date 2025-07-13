import { getCompanyDaimlerAG } from '../../model/company.mock';
import { Company } from '../../model/company.model';
import { getOutletStructureWith_OneMainHaving_TwoSublets } from '../../model/outlet-structure.mock';
import { OutletStructureActions } from '../actions';

import * as fromCompany from './company.reducers';

describe('Company Reducers', () => {
  const mockedCompany: Company = getCompanyDaimlerAG();
  const mockedOutletStructure = getOutletStructureWith_OneMainHaving_TwoSublets();

  describe('undefined action', () => {
    test('should return default state', () => {
      const action: any = {};
      const state = fromCompany.reducer(undefined, action);
      expect(state).toEqual(fromCompany.initialState);
    });
  });

  describe('loadOutletStructureSuccess', () => {
    test('returns unchanged company as state', () => {
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: 'some_outlet_id'
      });
      const expectedState = mockedCompany;
      const state = fromCompany.reducer(fromCompany.initialState, action);
      expect(state).toEqual(expectedState);
    });

    test('returns company with overwritten properties as state', () => {
      const beforeState: Company = { ...mockedCompany, city: 'Berlin' };
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: 'some_outlet_id'
      });
      const expectedState = mockedCompany;
      const state = fromCompany.reducer(beforeState, action);
      expect(state).toEqual(expectedState);
    });
  });
});
