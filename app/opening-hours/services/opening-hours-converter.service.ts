import { Injectable } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { sort } from '../brand-product-group/brand-product-group-order';
import {
  GroupedOpeningHour,
  SpecialOpeningHour,
  StandardOpeningHour
} from '../models/opening-hour.model';
import {
  GroupedOpeningHourColumn,
  OpeningHourAs24HourTimeFormat
} from '../presentational/brand-product-group-table/grouped-opening-hour-column.model';
import { Hours } from '../store/reducers';

import { OpeningHoursPermissionService } from './opening-hours-permission.service';

@Injectable()
export class OpeningHoursConverterService {
  constructor(private permissionService: OpeningHoursPermissionService) {}

  convertToGroupedOpeningHourColumns(
    hoursToShow: Hours,
    useSpecialOpeningHours: boolean,
    hasPagePermission: boolean,
    restrictedBrands: string[],
    restrictedProductGroups: string[],
    brands: string[]
  ): GroupedOpeningHourColumn[] {
    const isOtherBrand = function (
      brandId: string,
      hour: StandardOpeningHour | SpecialOpeningHour
    ): boolean {
      return hour && hour.brandId !== brandId;
    };

    const isLast = function (currentIndex: number, array: any[]): boolean {
      return currentIndex + 1 >= array.length;
    };

    if (useSpecialOpeningHours) {
      return sort(hoursToShow.specialOpeningHours, brands).map((specialHour, index, array) => {
        const groupId = specialHour.brandId + specialHour.productGroupIds.toString();
        return {
          columnDef: groupId,
          brandId: specialHour.brandId,
          productGroups: specialHour.productGroupIds.map(
            (productGroupId, indexProductGroup, arrayProductGroups) => {
              return {
                id: productGroupId,
                hasMoveLeftAction:
                  index !== 0 && !isOtherBrand(specialHour.brandId, array[index - 1]),
                hasMoveRightAction: arrayProductGroups.length !== 1,
                isActionEnabled:
                  hasPagePermission &&
                  this.permissionService.isMoveProductGroupAllowed(
                    specialHour.brandId,
                    productGroupId,
                    restrictedBrands,
                    restrictedProductGroups
                  )
              };
            }
          ),
          cell: (weekDay: UntypedFormControl) => {
            const weekDayOpeningHour = weekDay.value.openingHours[groupId];
            return this.getFormattedOpeningHour(weekDayOpeningHour);
          },
          isLastOfBrand:
            isLast(index, array) || isOtherBrand(specialHour.brandId, array[index + 1]),
          isEnabled:
            hasPagePermission &&
            this.permissionService.isEditTableCellAllowed(
              specialHour.brandId,
              specialHour.productGroupIds,
              restrictedBrands,
              restrictedProductGroups
            )
        };
      });
    } else {
      return sort(hoursToShow.standardOpeningHours, brands).map((standardHour, index, array) => {
        const groupId = standardHour.brandId + standardHour.productGroupIds.toString();
        return {
          columnDef: groupId,
          brandId: standardHour.brandId,
          productGroups: standardHour.productGroupIds.map(
            (productGroupId, indexProductGroup, arrayProductGroups) => {
              return {
                id: productGroupId,
                hasMoveLeftAction:
                  index !== 0 && !isOtherBrand(standardHour.brandId, array[index - 1]),
                hasMoveRightAction: arrayProductGroups.length !== 1,
                isActionEnabled:
                  hasPagePermission &&
                  this.permissionService.isMoveProductGroupAllowed(
                    standardHour.brandId,
                    productGroupId,
                    restrictedBrands,
                    restrictedProductGroups
                  )
              };
            }
          ),
          cell: (weekDay: UntypedFormControl) => {
            const weekDayOpeningHour = weekDay.value.openingHours[groupId];
            return this.getFormattedOpeningHour(weekDayOpeningHour);
          },
          isLastOfBrand:
            isLast(index, array) || isOtherBrand(standardHour.brandId, array[index + 1]),
          isEnabled:
            hasPagePermission &&
            this.permissionService.isEditTableCellAllowed(
              standardHour.brandId,
              standardHour.productGroupIds,
              restrictedBrands,
              restrictedProductGroups
            )
        };
      });
    }
  }
  private getFormattedOpeningHour(
    weekDayOpeningHour?: GroupedOpeningHour
  ): OpeningHourAs24HourTimeFormat {
    if (!weekDayOpeningHour) {
      return {};
    }

    return {
      times: weekDayOpeningHour.times,
      closed: weekDayOpeningHour.closed
    };
  }
}
