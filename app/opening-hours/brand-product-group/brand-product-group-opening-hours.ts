import { StandardOpeningHourResponse } from '../models/opening-hour-response.model';
import {
  GroupedOpeningHour,
  OpeningHour,
  SpecialOpeningHour,
  StandardOpeningHour,
  Times,
  WeekDayOpeningHours
} from '../models/opening-hour.model';
import { GroupedOpeningHourColumn } from '../presentational/brand-product-group-table/grouped-opening-hour-column.model';
import { Hours } from '../store/reducers';

import { sort } from './brand-product-group-order';
import { MultiSelectOfferedServiceIds } from '../../services/service/models/multi-select.model';

interface Group {
  groupId: string;
  times: Times[];
  closed: boolean;
  changed?: boolean;
  special?: boolean;
}

interface SpecialOpeningHoursForRequest {
  offeredServiceId: string;
  startDate: string;
  endDate: string;
  openingHours: OpeningHourConverted[];
}

interface OpeningHourConverted {
  day: string;
  times: Times[];
  closed: boolean;
}

export namespace OpeningHourConvertion {
  export function convertToWeekDaysOpeningHours(
    hours: Hours,
    useSpecialOpeningHours: boolean,
    brands: string[]
  ): WeekDayOpeningHours[] {
    if (useSpecialOpeningHours) {
      return fromSpecialOpeningHours(hours, brands);
    }
    return fromStandardOpeningHours(hours, brands);
  }

  function fromStandardOpeningHours(hours: Hours, brands: string[]): WeekDayOpeningHours[] {
    const weekDays: WeekDayOpeningHours[] = [];
    if (brands.length > 0) {
      sort(hours.standardOpeningHours, brands).map(standardOpeningHour => {
        standardOpeningHour.openingHours.map(openingHour => {
          const weekDay = weekDays.find(weekday => weekday.weekDay === openingHour.weekDay);
          const openingHourToAdd = getGroupedOpeningHour(standardOpeningHour, openingHour);
          if (weekDay) {
            weekDay.openingHours.push(openingHourToAdd);
          } else {
            weekDays.push(getWeekDayOpeningHours(openingHour, openingHourToAdd));
          }
        });
      });
    }
    return weekDays;
  }

  function fromSpecialOpeningHours(hours: Hours, brands: string[]): WeekDayOpeningHours[] {
    const weekDays: WeekDayOpeningHours[] = [];
    sort(hours.specialOpeningHours, brands).map(specialOpeningHour => {
      specialOpeningHour.openingHours.map(openingHour => {
        const weekDay = weekDays.find(weekday => weekday.weekDay === openingHour.weekDay);
        const openingHourToAdd = getGroupedOpeningHour(specialOpeningHour, openingHour);
        if (weekDay) {
          weekDay.openingHours.push(openingHourToAdd);
        } else {
          weekDays.push(getWeekDayOpeningHours(openingHour, openingHourToAdd));
        }
      });
    });
    return weekDays;
  }

  export function convertWeekDaysOpeningHoursToBrandProductGroupOpeningHours(
    groupedOpeningHourColumns: GroupedOpeningHourColumn[],
    weekdaysOpeningHours: WeekDayOpeningHours[],
    useSpecialOpeningHours: boolean,
    brands: string[]
  ): Hours {
    const brandProductGroupsOh: Hours = {
      standardOpeningHours: [],
      specialOpeningHours: []
    };
    const standardOpeningHours: StandardOpeningHour[] = [];
    const specialOpeningHours: SpecialOpeningHour[] = [];
    if (weekdaysOpeningHours) {
      const groupIds = groupedOpeningHourColumns.map(column => column.columnDef);
      groupIds.map(groupId => {
        const openingHours: OpeningHour[] = [];
        const map = getBrandAndProductGroups(groupId, brands);
        weekdaysOpeningHours.map(weekdaysOpeningHour => {
          const group: Group[] = weekdaysOpeningHour.openingHours
            .filter(groupedOpeningHour => groupedOpeningHour.groupId === groupId)
            .map(groupedOpeningHour => groupedOpeningHour);
          if (group.length > 0) {
            group.map(oh => {
              if (oh.changed === true) {
                openingHours.push({
                  weekDay: weekdaysOpeningHour.weekDay,
                  closed: oh.closed,
                  times: oh.times,
                  changed: true
                });
              } else {
                openingHours.push({
                  weekDay: weekdaysOpeningHour.weekDay,
                  closed: oh.closed,
                  times: oh.times
                });
              }
            });
          }
        });
        if (useSpecialOpeningHours) {
          specialOpeningHours.push({
            brandId: map.keys().next().value,
            productGroupIds: map.values().next().value,
            startDate: '',
            endDate: '',
            openingHours: openingHours,
            configured: true
          });
        } else {
          standardOpeningHours.push({
            brandId: map.keys().next().value,
            productGroupIds: map.values().next().value,
            openingHours: openingHours
          });
        }
      });
      brandProductGroupsOh.standardOpeningHours = standardOpeningHours;
      brandProductGroupsOh.specialOpeningHours = specialOpeningHours;
    }
    return brandProductGroupsOh;
  }

  export function getBrandAndProductGroups(
    groupId: string,
    brands: any
  ): Map<string, Array<string>> {
    const map = new Map<string, Array<string>>();
    for (const brand of brands) {
      if (groupId.startsWith(brand)) {
        map.set(brand, groupId.replace(brand, '').split(','));
      }
    }
    return map;
  }

  export function getStandardOpeningHourForRequest(
    standardOpeningHour: any[]
  ): StandardOpeningHourResponse[] {
    return standardOpeningHour.map(soh => ({
      brand: soh.brandId,
      productGroups: soh.productGroupIds,
      openingHours: soh.openingHours
        .filter((oh: any) => filterOpeningHour(oh))
        .map((oh: any) => createOpeningHour(oh))
    }));
  }

  export function getSpecialOpeningHourForRequest(specialOpeningHour: any[]): any[] {
    if (specialOpeningHour) {
      return specialOpeningHour.map(soh => ({
        startDate: soh.startDate,
        endDate: soh.endDate,
        brand: soh.brandId,
        productGroups: soh.productGroupIds,
        openingHours: soh.openingHours
          .filter((oh: any) => filterOpeningHour(oh))
          .map((oh: any) => createOpeningHour(oh))
      }));
    }
    return [];
  }

  function filterOpeningHour(openingHour: OpeningHour): boolean {
    const hasTimeValues = openingHour.times && openingHour.times.length !== 0;
    return hasTimeValues || openingHour.closed;
  }

  function createOpeningHour(openingHour: OpeningHour): any {
    if (openingHour.closed) {
      return {
        day: getWeekDay(openingHour.weekDay.valueOf()),
        closed: openingHour.closed
      };
    }
    return {
      day: getWeekDay(openingHour.weekDay.valueOf()),
      times: openingHour.times,
      closed: false
    };
  }

  function getWeekDay(day: number): string {
    let convertedDay = '';
    switch (day) {
      case 1:
        convertedDay = 'MO';
        break;
      case 2:
        convertedDay = 'TU';
        break;
      case 3:
        convertedDay = 'WE';
        break;
      case 4:
        convertedDay = 'TH';
        break;
      case 5:
        convertedDay = 'FR';
        break;
      case 6:
        convertedDay = 'SA';
        break;
      case 0:
        convertedDay = 'SU';
        break;
      default:
        convertedDay = 'MO';
        break;
    }
    return convertedDay;
  }

  function getGroupedOpeningHour(
    hours: StandardOpeningHour,
    openingHour: OpeningHour
  ): GroupedOpeningHour {
    return {
      groupId: hours.brandId + hours.productGroupIds.toString(),
      closed: openingHour.closed,
      times: openingHour.times,
      special: openingHour.special,
      index: openingHour.index
    };
  }

  function getWeekDayOpeningHours(
    standardOpeningHour: OpeningHour,
    groupedOpeningHour: GroupedOpeningHour
  ): WeekDayOpeningHours {
    return {
      weekDay: standardOpeningHour.weekDay,
      openingHours: [groupedOpeningHour]
    };
  }

  export function getMultiEditOpeningHoursForRequest(
    standardOpeningHours: StandardOpeningHour[],
    multiSelectOfferedServices: MultiSelectOfferedServiceIds[]
  ): any[] {
    return multiSelectOfferedServices
      .map(osi => ({
        offeredServiceId: osi.id,
        openingHours: convertOpeningHourForRequest(
          combineOpeningHours(
            standardOpeningHours
              ?.filter(soh => soh.brandId == osi.brandId)
              ?.filter(soh => soh.productGroupIds.includes(osi.productGroupId))
          )
        )
      }))
      .filter(x => x.openingHours.length > 0);
  }

  export function getMultiEditSpecialOpeningHoursForRequest(
    specialOpeningHours: SpecialOpeningHour[],
    multiSelectOfferedServices: MultiSelectOfferedServiceIds[]
  ): any[] {
    let specialOpeningHoursRequest: SpecialOpeningHoursForRequest[] = [];
    multiSelectOfferedServices.forEach(osi => {
      specialOpeningHours
        ?.filter(soh => soh.brandId == osi.brandId)
        ?.filter(soh => soh.productGroupIds.includes(osi.productGroupId))
        ?.forEach(soh => {
          const sohfr: SpecialOpeningHoursForRequest = {
            offeredServiceId: osi.id,
            startDate: soh.startDate,
            endDate: soh.endDate,
            openingHours: convertOpeningHourForRequest(soh.openingHours)
          };
          specialOpeningHoursRequest.push(sohfr);
        });
    });
    return specialOpeningHoursRequest;
  }

  function combineOpeningHours(standardOpeningHours: StandardOpeningHour[]): OpeningHour[] {
    let combinedOpeningHours: OpeningHour[] = [];
    standardOpeningHours.forEach(soh => {
      combinedOpeningHours.push(...soh.openingHours);
    });
    return combinedOpeningHours;
  }

  function convertOpeningHourForRequest(openingHours: OpeningHour[]): OpeningHourConverted[] {
    return openingHours
      .filter((oh: any) => filterOpeningHour(oh))
      .map((oh: any) => createOpeningHour(oh));
  }
}
