import { sisterOutletMock, offeredServicesMock } from '../../../shared/models/sister-outlet.mock';
import { OfferedServiceApiActions } from '../actions';
import * as fromSisterOutlet from './sister-outlet.reducer';

describe('Sister Outlet Reducers Suite', () => {
  describe('queryCompanySisterOutletSuccess action', () => {
    test('should change state', () => {
      const stateBefore = fromSisterOutlet.initialSisterOutletState;
      const action = OfferedServiceApiActions.queryCompanySisterOutletSuccess({
        sisterOutlets: sisterOutletMock.sisterOutlets,
        offeredServices: offeredServicesMock
      });
      const state = fromSisterOutlet.reducer(stateBefore, action);
      expect(state.sisterOutlets).toEqual(sisterOutletMock.sisterOutlets);
      expect(state.offeredServices).toEqual(offeredServicesMock);
    });
  });
  test('should not change state', () => {
    const stateBefore: fromSisterOutlet.SisterOutletState = {
      sisterOutlets: [],
      offeredServices: []
    };
    const expectedState = stateBefore;
    const action: any = {};
    const state = fromSisterOutlet.reducer(stateBefore, action);
    expect(state).toEqual(expectedState);
  });
});
