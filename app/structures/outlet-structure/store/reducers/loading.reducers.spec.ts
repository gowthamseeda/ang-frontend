import { ApiError } from '../../../../shared/services/api/api.service';
import { getCompanyDaimlerAG } from '../../model/company.mock';
import { Company } from '../../model/company.model';
import { getOutletStructureWith_OneMainHaving_TwoSublets } from '../../model/outlet-structure.mock';
import { OutletStructureActions } from '../actions';

import * as fromLoading from './loading.reducers';

describe('Structures Loading Reducers Suite', () => {
  const outletId = 'GS123456';

  describe('undefined action', () => {
    test('should not change state', () => {
      const action: any = {};
      const state = fromLoading.reducer(undefined, action);
      expect(state).toEqual(fromLoading.initialState);
    });
  });

  describe('loadOutletStructures action', () => {
    test('should set load to pending state and reset error state', () => {
      const beforeState = {
        isOutletStructureLoading: false,
        isError: true,
        errorMsg: 'error'
      };
      const expectedState = {
        isOutletStructureLoading: true,
        isError: false,
        errorMsg: ''
      };
      const action = OutletStructureActions.loadOutletStructures({ outletId: outletId });

      const state = fromLoading.reducer(beforeState, action);

      expect(state).toStrictEqual(expectedState);
    });
  });

  describe('loadOutletStructureSuccess action', () => {
    const mockedCompany: Company = getCompanyDaimlerAG();
    const mockedOutletStructure = getOutletStructureWith_OneMainHaving_TwoSublets();

    test('should reset load state', () => {
      const stateBefore = {
        isOutletStructureLoading: true,
        isError: false,
        errorMsg: ''
      };
      const expectedState = {
        isOutletStructureLoading: false,
        isError: false,
        errorMsg: ''
      };
      const action = OutletStructureActions.loadOutletStructureSuccess({
        company: mockedCompany,
        outletStructure: mockedOutletStructure,
        outletId: outletId
      });

      const state = fromLoading.reducer(stateBefore, action);

      expect(state).toStrictEqual(expectedState);
    });
  });

  describe('loadOutletStructureFailure action', () => {
    test('should reset load state and set error state with error message', () => {
      const error: ApiError = { message: 'ERROR', traceId: 'errorTraceId' };
      const beforeState = {
        isOutletStructureLoading: true,
        isError: false,
        errorMsg: ''
      };
      const expectedState = {
        isOutletStructureLoading: false,
        isError: true,
        errorMsg: `${error.message} (${error.traceId})`
      };
      const action = OutletStructureActions.loadOutletStructureFailure({ error: error });

      const state = fromLoading.reducer(beforeState, action);

      expect(state).toStrictEqual(expectedState);
    });
  });
});
