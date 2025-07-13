import { WeekDay } from '@angular/common';
import {
  selectSelectedSpecialOpeningHoursStart,
  selectEditableOpeningHourDays,
  selectSelectedSpecialOpeningHoursEnd,
  selectSelectedSpecialOpeningHours
} from './selected-special-opening-hours.selector';
import {
  getSpecialOpeningHours,
  getSpecialOpeningHoursMock
} from '../../models/brand-product-group-opening-hours.mock';
import moment from "moment";

describe('selectSelectedSpecialOpeningHourTimes', () => {
  test('should return start date of selected SpecialOpeningHour', () => {
    const state = { selectedSpecialOpeningHoursStart: '2016-01-26' };
    const selection = (selectSelectedSpecialOpeningHoursStart.projector as any)(state);
    expect(selection).toBe('2016-01-26');
  });

  test('should return selected SpecialOpeningHour', () => {
    const specialOpeningHours = getSpecialOpeningHours();
    const state = {
      hours: {
        standardOpeningHours: [],
        specialOpeningHours: specialOpeningHours
      }
    };
    const expectedState = {
      hours: {
        standardOpeningHours: [],
        specialOpeningHours: specialOpeningHours.filter(spOh => spOh.startDate === '2017-01-26')
      }
    };
    const selection = (selectSelectedSpecialOpeningHours.projector as any)(state, '2017-01-26');
    expect(selection).toStrictEqual(expectedState.hours);
  });

  test('should return end date of selected SpecialOpeningHours.', () => {
    const brandProductGroupOpeningHours = getSpecialOpeningHoursMock();
    const state = {
      hours: {
        standardOpeningHours: brandProductGroupOpeningHours.standardOpeningHours,
        specialOpeningHours: brandProductGroupOpeningHours.specialOpeningHours
      }
    };
    const startDate = new Date('2017-01-26').getTime();
    const selection = (selectSelectedSpecialOpeningHoursEnd.projector as any)(state, startDate);
    expect(selection).toBe(moment('2017-01-29').toDate().getTime());
  });

  test('should not return end date for not found SpecialOpeningHour.', () => {
    const brandProductGroupOpeningHours = getSpecialOpeningHoursMock();
    const state = {
      hours: {
        standardOpeningHours: brandProductGroupOpeningHours.standardOpeningHours,
        specialOpeningHours: brandProductGroupOpeningHours.specialOpeningHours
      }
    };
    const startDate = new Date('2100-01-26').getTime();
    const selection = (selectSelectedSpecialOpeningHoursEnd.projector as any)(state, startDate);
    expect(selection).toBe(undefined);
  });

  test('should return all week days for StandardOpeningHours.', () => {
    const selection = (selectEditableOpeningHourDays.projector as any)();
    expect(selection).toStrictEqual([
      WeekDay.Sunday,
      WeekDay.Monday,
      WeekDay.Tuesday,
      WeekDay.Wednesday,
      WeekDay.Thursday,
      WeekDay.Friday,
      WeekDay.Saturday
    ]);
  });

  test('should return only Monday for single day SpecialOpeningHours.', () => {
    const startDate = new Date('2017-01-23').getTime();
    const endDate = new Date('2017-01-23').getTime();
    const selection = selectEditableOpeningHourDays.projector(startDate, endDate);
    expect(selection).toStrictEqual([WeekDay.Monday]);
  });

  test('should return Monday and Tuesday for two day SpecialOpeningHours.', () => {
    const startDate = new Date('2017-01-23').getTime();
    const endDate = new Date('2017-01-24').getTime();
    const selection = selectEditableOpeningHourDays.projector(startDate, endDate);
    expect(selection).toStrictEqual([WeekDay.Monday, WeekDay.Tuesday]);
  });

  test('should return all week days for two week SpecialOpeningHours.', () => {
    const startDate = new Date('2017-01-23').getTime();
    const endDate = new Date('2017-02-05').getTime();
    const selection = selectEditableOpeningHourDays.projector(startDate, endDate);
    expect(selection).toContain(WeekDay.Sunday);
    expect(selection).toContain(WeekDay.Monday);
    expect(selection).toContain(WeekDay.Tuesday);
    expect(selection).toContain(WeekDay.Wednesday);
    expect(selection).toContain(WeekDay.Thursday);
    expect(selection).toContain(WeekDay.Friday);
    expect(selection).toContain(WeekDay.Saturday);
    expect(selection.length).toBe(7);
  });

  test('should not return any week days for invalid SpecialOpeningHours.', () => {
    const startDate = new Date('2017-01-23').getTime();
    const endDate = new Date('2017-02-05').getTime();
    const selection = selectEditableOpeningHourDays.projector(endDate, startDate);
    expect(selection).toStrictEqual([]);
  });
});
