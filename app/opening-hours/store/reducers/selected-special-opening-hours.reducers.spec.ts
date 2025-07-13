import * as fromSelectedSpecialOpeningHours from './selected-special-opening-hours.reducers';
import { SelectedOpeningHoursActions } from '../actions';

describe('Reducer Suite', () => {
  describe('undefined action', () => {
    test('does not change state', () => {
      const beforeState = fromSelectedSpecialOpeningHours.initialState;
      const action: any = {};

      const state = fromSelectedSpecialOpeningHours.reducer(beforeState, action);
      expect(state).toEqual(beforeState);
    });
  });

  describe('updateSelectedOpeningHours action', () => {
    test('changes state', () => {
      const beforeState = fromSelectedSpecialOpeningHours.initialState;
      const startDate = new Date(2019, 9);
      const action = SelectedOpeningHoursActions.updateSelectedSpecialOpeningHours({
        startDate: startDate.getTime()
      });

      const state = fromSelectedSpecialOpeningHours.reducer(beforeState, action);
      expect(state).toEqual(startDate.getTime());
    });
  });

  describe('closeSelectedOpeningHour action', () => {
    test('reset to initial state', () => {
      const beforeState = 9999;
      const action = SelectedOpeningHoursActions.closeSelectedSpecialOpeningHours();

      const state = fromSelectedSpecialOpeningHours.reducer(beforeState, action);
      expect(state).toEqual(fromSelectedSpecialOpeningHours.initialState);
    });
  });
});
