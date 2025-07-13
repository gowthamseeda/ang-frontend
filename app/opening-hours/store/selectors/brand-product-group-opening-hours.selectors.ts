import { createSelector } from '@ngrx/store';
import moment from 'moment';

import {
  OpeningHour,
  SpecialOpeningHour,
  StandardOpeningHour
} from '../../models/opening-hour.model';
import { Hours, OpeningHoursState, selectOpeningHoursState } from '../reducers';

import {
  selectSelectedSpecialOpeningHours,
  selectSelectedSpecialOpeningHoursStart
} from './selected-special-opening-hours.selector';

export const selectBrandProductGroupOpeningHoursState = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => {
    return state.hours;
  }
);

export const selectReducedStandardOpeningHoursState = createSelector(
  selectBrandProductGroupOpeningHoursState,
  (hours: Hours) => {
    const normalizedStandardHours: StandardOpeningHour[] = [];
    hours.standardOpeningHours.forEach((standardHour: StandardOpeningHour) => {
      const currentOpeningHours = [...standardHour.openingHours]
        .filter((hour: OpeningHour) => hour.closed || hour.times?.length > 0)
        .sort((firstHour, secondHour) => firstHour.weekDay - secondHour.weekDay)
        .map((hour: OpeningHour) => ({
          weekDay: hour.weekDay,
          closed: hour.closed,
          times: (hour.times ?? []).filter(time => time.begin !== '' && time.end !== '')
        })) as OpeningHour[];

      const currentStandardHour = {
        brandId: standardHour.brandId,
        productGroupIds: standardHour.productGroupIds,
        openingHours: currentOpeningHours
      } as StandardOpeningHour;

      let existingHourFound = false;

      normalizedStandardHours
        .filter(() => existingHourFound === false)
        .filter(existingHour => existingHour.brandId === currentStandardHour.brandId)
        .filter(existingHour => {
          const existingAsText = JSON.stringify(existingHour.openingHours).normalize();
          const currentAsText = JSON.stringify(currentOpeningHours).normalize();
          return existingAsText === currentAsText;
        })
        .forEach(existingHour => {
          existingHour.productGroupIds = [
            ...currentStandardHour.productGroupIds,
            ...existingHour.productGroupIds
          ];
          existingHourFound = true;
        });

      if (existingHourFound === false) {
        normalizedStandardHours.push(currentStandardHour);
      }
    });

    return normalizedStandardHours;
  }
);

export const selectReducedSpecialOpeningHoursState = createSelector(
  selectBrandProductGroupOpeningHoursState,
  (hours: Hours) => {
    const normalizedSpecialHours: SpecialOpeningHour[] = [];
    hours.specialOpeningHours
      .filter((specialHour: SpecialOpeningHour) => specialHour.configured)
      .forEach((specialHour: SpecialOpeningHour) => {
        const currentOpeningHours = [...specialHour.openingHours]
          .filter((hour: OpeningHour) => hour.closed || hour.times?.length > 0)
          .sort((firstHour, secondHour) => firstHour.weekDay - secondHour.weekDay)
          .map((hour: OpeningHour) => ({
            weekDay: hour.weekDay,
            closed: hour.closed,
            times: (hour.times ?? []).filter(time => time.begin !== '' && time.end !== '')
          })) as OpeningHour[];

        const currentSpecialHour = {
          brandId: specialHour.brandId,
          productGroupIds: specialHour.productGroupIds,
          startDate: specialHour.startDate,
          endDate: specialHour.endDate,
          configured: specialHour.configured,
          openingHours: currentOpeningHours
        } as SpecialOpeningHour;

        let existingHourFound = false;

        normalizedSpecialHours
          .filter(() => existingHourFound === false)
          .filter(existingHour => existingHour.brandId === currentSpecialHour.brandId)
          .filter(existingHour => existingHour.startDate === currentSpecialHour.startDate)
          .filter(existingHour => {
            const existingAsText = JSON.stringify(existingHour.openingHours).normalize();
            const currentAsText = JSON.stringify(currentOpeningHours).normalize();
            return existingAsText === currentAsText;
          })
          .forEach(existingHour => {
            existingHour.productGroupIds = [
              ...currentSpecialHour.productGroupIds,
              ...existingHour.productGroupIds
            ];
            existingHourFound = true;
          });

        if (existingHourFound === false) {
          normalizedSpecialHours.push(currentSpecialHour);
        }
      });

    return normalizedSpecialHours;
  }
);

export const selectSelectedBrandProductGroupOpeningHoursState = createSelector(
  selectBrandProductGroupOpeningHoursState,
  selectSelectedSpecialOpeningHours,
  selectSelectedSpecialOpeningHoursStart,
  (standardOpeningHours: Hours, selectedSpecialOpeningHours: Hours, startDate: number) => {
    if (startDate && startDate !== -1) {
      const mergeSpecialOpeningHour: SpecialOpeningHour[] = [];
      selectedSpecialOpeningHours.specialOpeningHours.forEach(specialOpeningHour => {
        const mergeOpeningHours: OpeningHour[] = [];
        const standardOpeningHour = selectedSpecialOpeningHours.standardOpeningHours.find(
          stOh =>
            stOh.brandId === specialOpeningHour.brandId &&
            specialOpeningHour.productGroupIds.every(element =>
              stOh.productGroupIds.includes(element)
            )
        );
        if (standardOpeningHour) {
          initOpeningHours()
            .map(initStandard => {
              const openingHour = standardOpeningHour.openingHours.find(
                foh => foh.weekDay === initStandard.weekDay
              );
              return openingHour ? openingHour : initStandard;
            })
            .forEach(standardOh => {
              const specialWeekDay = specialOpeningHour.openingHours.find(
                oh => oh.weekDay === standardOh.weekDay
              );
              mergeOpeningHours.push(
                specialWeekDay ? { ...specialWeekDay, special: true } : standardOh
              );
            });
          mergeSpecialOpeningHour.push({
            brandId: specialOpeningHour.brandId,
            endDate: specialOpeningHour.endDate,
            startDate: specialOpeningHour.startDate,
            productGroupIds: specialOpeningHour.productGroupIds,
            openingHours: mergeOpeningHours,
            configured: specialOpeningHour.configured
          });
        } else {
          mergeSpecialOpeningHour.push({
            brandId: specialOpeningHour.brandId,
            endDate: specialOpeningHour.endDate,
            startDate: specialOpeningHour.startDate,
            productGroupIds: specialOpeningHour.productGroupIds,
            openingHours: specialOpeningHour.openingHours.map(hour => ({ ...hour, special: true })),
            configured: specialOpeningHour.configured
          });
        }
      });
      return {
        standardOpeningHours: standardOpeningHours.standardOpeningHours,
        specialOpeningHours: mergeSpecialOpeningHour
      };
    }
    return standardOpeningHours;
  }
);

export const selectStandardOpeningHours = createSelector(
  selectBrandProductGroupOpeningHoursState,
  (hours: Hours) => {
    return hours.standardOpeningHours;
  }
);

export const selectSpecialOpeningHours = createSelector(
  selectBrandProductGroupOpeningHoursState,
  (hours: Hours) => {
    return hours.specialOpeningHours;
  }
);

export const selectIsDataChangeTaskPresentForOpeningHours = createSelector(
  selectBrandProductGroupOpeningHoursState,
  (hours: Hours) => {
    return hours.dataChangeTaskPresent;
  }
);

export const selectIsVerificationTaskPresentForOpeningHours = createSelector(
  selectBrandProductGroupOpeningHoursState,
  (hours: Hours) => {
    return hours.verificationTaskPresent;
  }
);

export const selectFilteredSpecialOpeningHours = (fromDate: Date) =>
  createSelector(selectSpecialOpeningHours, (specialHours: SpecialOpeningHour[]) => {
    return specialHours.filter(specialHour => moment(specialHour.endDate).isSameOrAfter(fromDate));
  });

export const selectBrandProductGroupOpeningHoursSavingStatus = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => state.savingStatus
);

export const selectOpeningHoursOutletBusinessSiteIdState = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => {
    return state.outlet.businessSiteId;
  }
);

export const selectSpecialOpeningHourEvents = (fromDate: Date) =>
  createSelector(selectOpeningHoursState, (state: OpeningHoursState) => {
    if (state.hours.specialOpeningHours) {
      return state.hours.specialOpeningHours
        .map((groupedHours: SpecialOpeningHour) => {
          return groupedHours;
        })
        .filter(specialOpeningHour => moment(specialOpeningHour.endDate).isSameOrAfter(fromDate))
        .filter((specialOpeningHour, index, all) => {
          return (
            all.findIndex(hour => {
              return (
                hour.startDate === specialOpeningHour.startDate &&
                hour.endDate === specialOpeningHour.endDate
              );
            }) === index
          );
        });
    }
    return [];
  });

export interface BrandProductGroupInfo {
  brandId: string;
  productGroupIds: string[];
  hasHours: boolean;
}

export interface GroupedSpecialOpeningHour {
  startDate: string;
  endDate: string;
  brandProductGroupInfo: BrandProductGroupInfo[];
  configured: boolean;
}

export const selectGroupedSpecialHoursAfter = (fromDate: Date) =>
  createSelector(selectFilteredSpecialOpeningHours(fromDate), specialHoursFilteredByDate => {
    const groupedEvents: GroupedSpecialOpeningHour[] = [];

    return specialHoursFilteredByDate
      .filter(specialHour => specialHour.configured)
      .reduce((specialHours, specialHour) => {
        const existingEvent = specialHours.find(event => event.startDate === specialHour.startDate);
        const column: BrandProductGroupInfo = {
          brandId: specialHour.brandId,
          productGroupIds: specialHour.productGroupIds,
          hasHours: specialHour.openingHours.length > 0
        };
        if (existingEvent) {
          existingEvent.brandProductGroupInfo.push(column);
        } else {
          specialHours.push({
            startDate: specialHour.startDate,
            endDate: specialHour.endDate,
            brandProductGroupInfo: [column],
            configured: specialHour.configured
          });
        }
        return specialHours;
      }, groupedEvents)
      .sort((prevEvent: GroupedSpecialOpeningHour, nextEvent: GroupedSpecialOpeningHour) => {
        return moment(nextEvent.startDate).isAfter(prevEvent.startDate) ? -1 : 1;
      });
  });

function initOpeningHours(): OpeningHour[] {
  return [1, 2, 3, 4, 5, 6, 0].map(dayOfWeek => ({
    weekDay: dayOfWeek,
    times: [],
    closed: false
  }));
}
