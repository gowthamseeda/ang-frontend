import {
  OpeningHour,
  SpecialOpeningHour,
  StandardOpeningHour,
  Times
} from 'app/opening-hours/models/opening-hour.model';
import moment from 'moment';

import { Hours } from '../store/reducers';

const INPUT_FORMAT_12 = 'hh:mm A';
const INPUT_FORMAT_24 = 'HH:mm';
export const TIME_FORMAT_12 = 12;
export const TIME_FORMAT_24 = 24;

export function formatHours(hours: Hours): Hours {
  return {
    ...hours,
    standardOpeningHours: hours.standardOpeningHours?.map((hour: StandardOpeningHour) => ({
      ...hour,
      openingHours: formatOpeningHours(hour.openingHours)
    })),
    specialOpeningHours: hours.specialOpeningHours?.map((hour: SpecialOpeningHour) => ({
      ...hour,
      openingHours: formatOpeningHours(hour.openingHours)
    }))
  };
}

export function formatOpeningHours(hours: OpeningHour[]): OpeningHour[] {
  return hours?.map(openingHour => ({
    ...openingHour,
    times: openingHour.times
      ?.filter((time: Times) => time.begin.trim() !== '' || time.end.trim() !== '')
      .map((time: Times) => ({
        ...time,
        begin: formatTime(time.begin),
        end: formatTime(time.end)
      }))
  }));
}

export function formatTimes(times: Times[]): Times[] {
  return times.map(time => ({
    ...time,
    begin: formatTime(time.begin),
    end: formatTime(time.end)
  }));
}

export function formatTime(value: string, format = TIME_FORMAT_24): string {
  if (format === TIME_FORMAT_24) {
    return value && value !== '' ? moment(value, INPUT_FORMAT_12).format(INPUT_FORMAT_24) : value;
  }
  return value && value !== '' ? moment(value, INPUT_FORMAT_24).format(INPUT_FORMAT_12) : value;
}

export function timeFormatOf(locale: string): number {
  const now = new Date().toLocaleTimeString(locale);
  const isTimeFormat12 = now.includes('AM') || now.includes('PM');
  return isTimeFormat12 ? TIME_FORMAT_12 : TIME_FORMAT_24;
}
