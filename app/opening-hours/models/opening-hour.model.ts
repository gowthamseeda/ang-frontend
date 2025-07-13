import { WeekDay } from '@angular/common';
import {OpeningHoursDiffData} from "../../tasks/task.model";

export const EMPTY_HOUR = '';
export const INITIAL_HOUR = '00:00';

export interface WeekDayOpeningHours {
  weekDay: WeekDay;
  openingHours: GroupedOpeningHour[];
}

export interface GroupedOpeningHour {
  groupId: string;
  times: Times[];
  closed: boolean;
  changed?: boolean;
  special?: boolean;
  index?: number;
  notification?: string;
  dataChangeTask?: OpeningHoursDiffData | null;
}

export interface OpeningHour {
  weekDay: WeekDay;
  times: Times[];
  closed: boolean;
  transient?: boolean;
  changed?: boolean;
  special?: boolean;
  index?: number;
}

export interface StandardOpeningHour {
  brandId: string;
  productGroupIds: string[];
  openingHours: OpeningHour[];
}

export interface SpecialOpeningHour extends StandardOpeningHour {
  configured: boolean;
  startDate: string;
  endDate: string;
}

export interface Times {
  begin: string;
  end: string;
  enabled?: boolean;
}
