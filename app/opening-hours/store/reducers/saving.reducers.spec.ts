import { EventCreationState, SavingStatus } from '../../models/saving-status.model';
import { BrandProductGroupOpeningHoursActions, SelectedOpeningHoursActions } from '../actions';

import * as fromSavingState from './saving.reducers';

describe('Saving Reducer Suite', () => {
  const initialState: SavingStatus = {
    updated: false,
    newEventState: EventCreationState.None
  };

  const updatedState: SavingStatus = {
    updated: true,
    newEventState: EventCreationState.None
  };

  test('test specialOpeningHoursFirstDaySelected action', () => {
    const action = BrandProductGroupOpeningHoursActions.specialOpeningHoursFirstDaySelected;
    let actualState = fromSavingState.reducer(initialState, action);
    let expectedState = { ...initialState, newEventState: EventCreationState.FirstDay };
    expect(actualState).toEqual(expectedState);

    actualState = fromSavingState.reducer(updatedState, action);
    expectedState = { ...updatedState, newEventState: EventCreationState.FirstDay };
    expect(actualState).toEqual(expectedState);
  });

  test('test specialOpeningHoursSecondDaySelected action', () => {
    const action = BrandProductGroupOpeningHoursActions.specialOpeningHoursSecondDaySelected;
    let actualState = fromSavingState.reducer(initialState, action);
    let expectedState = { ...initialState, newEventState: EventCreationState.SecondDay };
    expect(actualState).toEqual(expectedState);

    actualState = fromSavingState.reducer(updatedState, action);
    expectedState = { ...updatedState, newEventState: EventCreationState.SecondDay };
    expect(actualState).toEqual(expectedState);
  });

  test('test specialOpeningHoursChangedFirstTime action', () => {
    const action = BrandProductGroupOpeningHoursActions.specialOpeningHoursChangedFirstTime;
    const actualState = fromSavingState.reducer(initialState, action);
    const expectedState = {
      ...initialState,
      newEventState: EventCreationState.Updated
    };
    expect(actualState).toEqual(expectedState);
  });

  test('test openingHoursUpdateSuccess action', () => {
    const action = BrandProductGroupOpeningHoursActions.openingHoursUpdateSuccess;
    const actualState = fromSavingState.reducer(initialState, action);
    const expectedState = { ...initialState, updated: false };
    expect(actualState).toEqual(expectedState);
  });

  test('test closeSelectedSpecialOpeningHours action', () => {
    const action = SelectedOpeningHoursActions.closeSelectedSpecialOpeningHours;
    let actualState = fromSavingState.reducer(initialState, action);
    let expectedState = { ...initialState, newEventState: EventCreationState.None };
    expect(actualState).toEqual(expectedState);

    actualState = fromSavingState.reducer(updatedState, action);
    expectedState = { ...updatedState, newEventState: EventCreationState.None };
    expect(actualState).toEqual(expectedState);
  });

  test('test removeUnchangedSpecialOpeningHours action', () => {
    const action = BrandProductGroupOpeningHoursActions.removeUnchangedSpecialOpeningHours;
    let actualState = fromSavingState.reducer(initialState, action);
    let expectedState = { ...initialState, newEventState: EventCreationState.None };
    expect(actualState).toEqual(expectedState);

    actualState = fromSavingState.reducer(updatedState, action);
    expectedState = { ...updatedState, newEventState: EventCreationState.None };
    expect(actualState).toEqual(expectedState);
  });

  test('test updateSavingStatus action with true', () => {
    const action = BrandProductGroupOpeningHoursActions.updateSavingStatus({ updated: true });
    const actualState = fromSavingState.reducer(initialState, action);
    const expectedState = { ...initialState, updated: true };
    expect(actualState).toEqual(expectedState);
  });

  test('test updateSavingStatus action with false', () => {
    const action = BrandProductGroupOpeningHoursActions.updateSavingStatus({ updated: false });
    const actualState = fromSavingState.reducer(initialState, action);
    const expectedState = { ...initialState, updated: false };
    expect(actualState).toEqual(expectedState);
  });
});
