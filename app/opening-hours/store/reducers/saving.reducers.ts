import { createReducer, on } from '@ngrx/store';

import { EventCreationState } from '../../models/saving-status.model';
import { SavingStatus } from '../../models/saving-status.model';
import {
  brandProductGroupOpeningHoursLoadSuccess,
  openingHoursUpdateSuccess,
  removeUnchangedSpecialOpeningHours,
  specialOpeningHoursChangedFirstTime,
  specialOpeningHoursFirstDaySelected,
  specialOpeningHoursSecondDaySelected,
  updateSavingStatus
} from '../actions/brand-product-group-opening-hours.actions';
import { closeSelectedSpecialOpeningHours } from '../actions/selected-opening-hours.action';

export const initialState: SavingStatus = {
  updated: false,
  newEventState: EventCreationState.None
};

export const reducer = createReducer(
  initialState,
  on(specialOpeningHoursFirstDaySelected, stateBefore => ({
    ...stateBefore,
    newEventState: EventCreationState.FirstDay
  })),
  on(specialOpeningHoursSecondDaySelected, stateBefore => ({
    ...stateBefore,
    newEventState: EventCreationState.SecondDay
  })),
  on(specialOpeningHoursChangedFirstTime, stateBefore => ({
    ...stateBefore,
    newEventState: EventCreationState.Updated
  })),
  on(openingHoursUpdateSuccess, () => ({
    ...initialState
  })),
  on(brandProductGroupOpeningHoursLoadSuccess, () => ({
    ...initialState
  })),
  on(closeSelectedSpecialOpeningHours, stateBefore => ({
    ...stateBefore,
    newEventState: EventCreationState.None
  })),
  on(removeUnchangedSpecialOpeningHours, stateBefore => ({
    ...stateBefore,
    newEventState: EventCreationState.None
  })),
  on(updateSavingStatus, (stateBefore, action) => {
    return { ...stateBefore, updated: action.updated };
  })
);
