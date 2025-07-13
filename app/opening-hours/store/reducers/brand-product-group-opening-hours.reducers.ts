import { createReducer, on } from '@ngrx/store';
import moment, { Moment } from 'moment';

import { SpecialOpeningHour, StandardOpeningHour } from '../../models/opening-hour.model';
import {
  brandProductGroupOpeningHoursLoadSuccess,
  deleteSpecialOpeningHours,
  detachProductGroupFromBrand,
  Direction,
  dropProductGroupColumn,
  initMultiEditOpeningHours,
  loadTaskSuccess,
  moveSpecialOpeningHoursProductGroup,
  moveStandardOpeningHoursProductGroup,
  openingHoursUpdateSuccess,
  removeUnchangedSpecialOpeningHours,
  resetSpecialOpeningHours,
  specialOpeningHoursChangedFirstTime,
  specialOpeningHoursFirstDaySelected,
  specialOpeningHoursSecondDaySelected,
  updateOpeningHours
} from '../actions/brand-product-group-opening-hours.actions';

import { Hours } from './index';

export const initialState: Hours = {
  standardOpeningHours: [],
  specialOpeningHours: []
};

export const reducer = createReducer(
  initialState,
  on(
    brandProductGroupOpeningHoursLoadSuccess,
    initMultiEditOpeningHours,
    (stateBefore, { hours }) => {
      return {
        ...stateBefore,
        standardOpeningHours: hours.standardOpeningHours,
        specialOpeningHours: hours.specialOpeningHours
      };
    }
  ),
  on(openingHoursUpdateSuccess, (stateBefore, { hours, taskData }) => {
    return {
      ...stateBefore,
      standardOpeningHours: hours.standardOpeningHours,
      specialOpeningHours: hours.specialOpeningHours,
      dataChangeTaskPresent: taskData ? true : undefined
    };
  }),
  on(loadTaskSuccess, (stateBefore, { dataChangeTaskPresent, verificationTaskPresent }) => {
    return {
      ...stateBefore,
      dataChangeTaskPresent: dataChangeTaskPresent,
      verificationTaskPresent: verificationTaskPresent
    };
  }),
  on(specialOpeningHoursFirstDaySelected, (stateBefore, { date }) => {
    const formattedDate: string = moment(date).format('YYYY-MM-DD');
    const specialOpeningHours: SpecialOpeningHour[] = [];
    stateBefore.standardOpeningHours.forEach(bPG => {
      specialOpeningHours.push({
        brandId: bPG.brandId,
        productGroupIds: bPG.productGroupIds,
        startDate: formattedDate,
        endDate: formattedDate,
        openingHours: [],
        configured: false
      });
    });
    return {
      ...stateBefore,
      specialOpeningHours: specialOpeningHours.concat(stateBefore.specialOpeningHours)
    };
  }),
  on(
    specialOpeningHoursSecondDaySelected,
    (stateBefore, { creationDate, firstDateSelected, secondDateSelected }) => {
      return {
        ...stateBefore,
        specialOpeningHours: stateBefore.specialOpeningHours.map(specialHour => {
          const isToChange = moment(specialHour.startDate).isSame(moment(creationDate), 'd');
          const earliestDate = getEarliestDay(
            moment(firstDateSelected),
            moment(secondDateSelected)
          );
          const latestDate = getLatestDay(moment(firstDateSelected), moment(secondDateSelected));

          const start = isToChange ? earliestDate.format('YYYY-MM-DD') : specialHour.startDate;
          const end = isToChange ? latestDate.format('YYYY-MM-DD') : specialHour.endDate;

          return {
            ...specialHour,
            startDate: start,
            endDate: end
          };
        })
      };
    }
  ),
  on(removeUnchangedSpecialOpeningHours, stateBefore => {
    return {
      ...stateBefore,
      specialOpeningHours: stateBefore.specialOpeningHours.filter(
        specialHour => specialHour.configured
      )
    };
  }),
  on(specialOpeningHoursChangedFirstTime, (stateBefore, { date, hours }) => {
    const updatedSpecialHours = stateBefore.specialOpeningHours.map(specialHour => {
      const isRelevant = moment(specialHour.startDate).isSame(date, 'd');
      if (isRelevant) {
        const changedByUser = hours.specialOpeningHours.find(
          special =>
            special.brandId === specialHour.brandId &&
            special.productGroupIds.slice().sort().toString() ===
              specialHour.productGroupIds.slice().sort().toString()
        );
        const changed: SpecialOpeningHour = {
          brandId: specialHour.brandId,
          productGroupIds: specialHour.productGroupIds,
          openingHours: [],
          startDate: specialHour.startDate,
          endDate: specialHour.endDate,
          configured: true
        };

        if (changedByUser) {
          changed.openingHours = changedByUser.openingHours
            .filter(oh => oh.changed)
            .map(oh => {
              return { closed: oh.closed, times: oh.times, weekDay: oh.weekDay };
            });
        }
        return changed;
      }
      return specialHour;
    });
    return {
      ...stateBefore,
      specialOpeningHours: updatedSpecialHours
    };
  }),
  on(deleteSpecialOpeningHours, (stateBefore, { date }) => {
    const convertedDate = moment(date).format('YYYY-MM-DD');
    return {
      ...stateBefore,
      specialOpeningHours: stateBefore.specialOpeningHours.filter(
        openingHour => openingHour.startDate !== convertedDate
      )
    };
  }),
  on(detachProductGroupFromBrand, (stateBefore, { brandId, productGroupId, startDate }) => {
    if (startDate === undefined || startDate === -1) {
      const hours: StandardOpeningHour[] = [];
      stateBefore.standardOpeningHours.forEach(hour => {
        if (hour.brandId === brandId && hour.productGroupIds.includes(productGroupId)) {
          hours.push({
            brandId: hour.brandId,
            productGroupIds: hour.productGroupIds.filter(
              item => item.toString() !== productGroupId
            ),
            openingHours: hour.openingHours
          });
          hours.push({
            brandId: hour.brandId,
            productGroupIds: [productGroupId],
            openingHours: hour.openingHours
          });
        } else {
          hours.push(hour);
        }
      });
      return {
        ...stateBefore,
        standardOpeningHours: hours
      };
    } else {
      const hours: SpecialOpeningHour[] = [];
      stateBefore.specialOpeningHours.forEach(specialHour => {
        const isSameStartDate = moment(specialHour.startDate).isSame(startDate, 'day');
        if (
          specialHour.brandId === brandId &&
          isSameStartDate &&
          specialHour.productGroupIds.includes(productGroupId)
        ) {
          const source: SpecialOpeningHour = {
            brandId: specialHour.brandId,
            productGroupIds: [],
            openingHours: specialHour.openingHours,
            startDate: specialHour.startDate,
            endDate: specialHour.endDate,
            configured: specialHour.configured
          };

          hours.push({
            ...source,
            productGroupIds: specialHour.productGroupIds.filter(
              item => item.toString() !== productGroupId
            )
          });
          hours.push({
            ...source,
            productGroupIds: [productGroupId]
          });
        } else {
          hours.push(specialHour);
        }
      });
      return {
        ...stateBefore,
        specialOpeningHours: hours
      };
    }
  }),
  on(dropProductGroupColumn, (stateBefore, { brandId, productGroupId, startDate }) => {
    const compareByIdProductGroups = function (
      hours: StandardOpeningHour | SpecialOpeningHour
    ): boolean {
      return hours.brandId === brandId && hours.productGroupIds.join() === productGroupId;
    };

    let indexToDrop: number;
    if (startDate === undefined) {
      indexToDrop = stateBefore.standardOpeningHours.findIndex(compareByIdProductGroups);
      const changedStandardHours = stateBefore.standardOpeningHours.map((standardHour, index) => {
        if (index === indexToDrop - 1) {
          return {
            ...standardHour,
            productGroupIds: [...standardHour.productGroupIds, productGroupId]
          };
        }
        return standardHour;
      });
      changedStandardHours.splice(indexToDrop, 1);

      return {
        ...stateBefore,
        standardOpeningHours: changedStandardHours
      };
    }

    indexToDrop = stateBefore.specialOpeningHours.findIndex(
      hour => moment(hour.startDate).isSame(startDate, 'd') && compareByIdProductGroups(hour)
    );
    const changedSpecialHours = stateBefore.specialOpeningHours.map((specialHour, index) => {
      if (index === indexToDrop - 1) {
        return {
          ...specialHour,
          productGroupIds: [...specialHour.productGroupIds, productGroupId]
        };
      }
      return specialHour;
    });
    changedSpecialHours.splice(indexToDrop, 1);

    return {
      ...stateBefore,
      specialOpeningHours: changedSpecialHours
    };
  }),
  on(
    moveStandardOpeningHoursProductGroup,
    (stateBefore, { brandId, productGroupId, direction }) => {
      const compareByIdProductGroups = function (hours: StandardOpeningHour): boolean {
        return hours.brandId === brandId && hours.productGroupIds.some(id => id === productGroupId);
      };

      const indexFrom = stateBefore.standardOpeningHours.findIndex(compareByIdProductGroups);
      const changedStandardHours = stateBefore.standardOpeningHours.map((standardHour, index) => {
        if (index === indexFrom) {
          return {
            ...standardHour,
            productGroupIds: standardHour.productGroupIds.filter(id => id !== productGroupId)
          };
        }
        if (direction === Direction.Left && index === indexFrom - 1) {
          return {
            ...standardHour,
            productGroupIds: [...standardHour.productGroupIds, productGroupId]
          };
        }
        if (direction === Direction.Right && index === indexFrom + 1) {
          return {
            ...standardHour,
            productGroupIds: [...standardHour.productGroupIds, productGroupId]
          };
        }

        return standardHour;
      });

      return {
        ...stateBefore,
        standardOpeningHours: changedStandardHours
      };
    }
  ),
  on(
    moveSpecialOpeningHoursProductGroup,
    (stateBefore, { brandId, productGroupId, startDate, direction }) => {
      const compareByIdProductGroups = function (hours: SpecialOpeningHour): boolean {
        return hours.brandId === brandId && hours.productGroupIds.some(id => id === productGroupId);
      };

      const indexFrom = stateBefore.specialOpeningHours.findIndex(
        hour => moment(hour.startDate).isSame(startDate, 'd') && compareByIdProductGroups(hour)
      );

      const changedSpecialHours = stateBefore.specialOpeningHours.map((specialHour, index) => {
        if (index === indexFrom) {
          return {
            ...specialHour,
            productGroupIds: specialHour.productGroupIds.filter(id => id !== productGroupId)
          };
        }
        if (direction === Direction.Left && index === indexFrom - 1) {
          return {
            ...specialHour,
            productGroupIds: [...specialHour.productGroupIds, productGroupId]
          };
        }
        if (direction === Direction.Right && index === indexFrom + 1) {
          return {
            ...specialHour,
            productGroupIds: [...specialHour.productGroupIds, productGroupId]
          };
        }

        return specialHour;
      });

      return {
        ...stateBefore,
        specialOpeningHours: changedSpecialHours
      };
    }
  ),
  on(updateOpeningHours, (stateBefore, { date, hours }) => {
    if (hours.specialOpeningHours.length === 0) {
      return { ...stateBefore, standardOpeningHours: hours.standardOpeningHours };
    }
    const unchangedSpecialOpeningHourState = stateBefore.specialOpeningHours.filter(
      sp => !moment(sp.startDate).isSame(date, 'd')
    );
    const selectedSpecialOpeningHourState = stateBefore.specialOpeningHours.filter(sp =>
      moment(sp.startDate).isSame(date, 'd')
    );
    let changedSpecialOpeningHours: any;

    changedSpecialOpeningHours = hours.specialOpeningHours.map(sp => {
      const storeColumn = selectedSpecialOpeningHourState.find(
        selSp =>
          selSp.brandId === sp.brandId &&
          selSp.productGroupIds.slice().sort().toString() ===
            sp.productGroupIds.slice().sort().toString()
      );

      if (storeColumn) {
        const changedRows = sp.openingHours
          .filter(weekDayHours => weekDayHours.changed)
          .map(weekDayHours => ({
            weekDay: weekDayHours.weekDay,
            closed: weekDayHours.closed,
            times: weekDayHours.times
          }))
          .reduce((allChangedHours: any[], weekDayHours) => {
            allChangedHours.push(weekDayHours);
            return allChangedHours;
          }, []);

        const notChangedRows = storeColumn.openingHours.filter(storeRow =>
          changedRows.every(changedRow => changedRow.weekDay !== storeRow.weekDay)
        );

        return {
          ...sp,
          openingHours: notChangedRows.concat(changedRows),
          startDate: moment(storeColumn ? storeColumn.startDate : '').format('YYYY-MM-DD'),
          endDate: moment(storeColumn ? storeColumn.endDate : '').format('YYYY-MM-DD')
        };
      } else {
        return storeColumn;
      }
    });
    return {
      ...stateBefore,
      specialOpeningHours: unchangedSpecialOpeningHourState.concat(changedSpecialOpeningHours)
    };
  }),
  on(
    resetSpecialOpeningHours,
    (stateBefore, { date, restrictedBrands, restrictedProductGroups }) => {
      const isRelevant = function (specialHour: SpecialOpeningHour): boolean {
        return (
          moment(specialHour.startDate).isSame(date, 'd') &&
          (restrictedBrands.length === 0 ||
            restrictedBrands.some(brand => brand === specialHour.brandId)) &&
          (restrictedProductGroups.length === 0 ||
            specialHour.productGroupIds.every(element => restrictedProductGroups.includes(element)))
        );
      };
      const resetSpecialHours: SpecialOpeningHour[] = stateBefore.specialOpeningHours.map(
        specialHour => {
          return isRelevant(specialHour) ? { ...specialHour, openingHours: [] } : specialHour;
        }
      );

      return { ...stateBefore, specialOpeningHours: resetSpecialHours };
    }
  )
);

function getEarliestDay(first: Moment, second: Moment): Moment {
  if (first.isAfter(second)) {
    return second;
  }
  return first;
}

function getLatestDay(first: Moment, second: Moment): Moment {
  if (first.isAfter(second)) {
    return first;
  }
  return second;
}
