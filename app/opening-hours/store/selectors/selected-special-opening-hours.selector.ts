import { WeekDay } from '@angular/common';
import { createSelector } from '@ngrx/store';
import moment from 'moment';
import { clone } from 'ramda';

import { SpecialOpeningHour } from '../../models/opening-hour.model';
import { Hours, OpeningHoursState, selectOpeningHoursState } from '../reducers';

export const selectSelectedSpecialOpeningHoursStart = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => {
    return state.selectedSpecialOpeningHoursStart;
  }
);

export const selectSelectedSpecialOpeningHoursEnd = createSelector(
  selectOpeningHoursState,
  selectSelectedSpecialOpeningHoursStart,
  (state: OpeningHoursState, startDate: number) => {
    const hours = state.hours.specialOpeningHours.find(hour =>
      moment(hour.startDate).isSame(startDate, 'day')
    );
    return hours ? moment(hours.endDate).valueOf() : hours;
  }
);

export const selectEditableOpeningHourDays = createSelector(
  selectSelectedSpecialOpeningHoursStart,
  selectSelectedSpecialOpeningHoursEnd,
  (startDate: number, endDate: number) => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const weekDays: Set<WeekDay> = new Set();
      while (start.isSameOrBefore(moment(endDate))) {
        weekDays.add(start.weekday());
        start.add(1, 'day');
      }
      return Array.from(weekDays);
    }

    return [
      WeekDay.Sunday,
      WeekDay.Monday,
      WeekDay.Tuesday,
      WeekDay.Wednesday,
      WeekDay.Thursday,
      WeekDay.Friday,
      WeekDay.Saturday
    ];
  }
);

export const selectSelectedSpecialOpeningHours = createSelector(
  selectOpeningHoursState,
  selectSelectedSpecialOpeningHoursStart,
  (state: OpeningHoursState, start: number) => {
    if (start < 0) {
      return undefined;
    }
    const startDate = new Date(start);
    const brandProductGroupOpeningHourState = state.hours;
    const stateHourClone: Hours = clone(state.hours);
    const specialOpeningHours: SpecialOpeningHour[] = [];
    if (brandProductGroupOpeningHourState && stateHourClone.specialOpeningHours) {
      for (const specialOpeningHour of stateHourClone.specialOpeningHours) {
        if (moment(specialOpeningHour.startDate).toDate().toDateString() === startDate.toDateString()) {
          specialOpeningHours.push(specialOpeningHour);
        }
      }
    }
    stateHourClone.specialOpeningHours = [];
    stateHourClone.specialOpeningHours = specialOpeningHours;
    return stateHourClone;
  }
);
