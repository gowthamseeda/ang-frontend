import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { TaskFooterEvent } from '../../tasks/task.model';
import { Hours } from '../store/reducers';
import { formatHours } from '../util/opening-hours-formatter';

import {
  deleteSpecialOpeningHours,
  detachProductGroupFromBrand,
  Direction,
  dropProductGroupColumn,
  initMultiEditOpeningHours,
  moveSpecialOpeningHoursProductGroup,
  moveStandardOpeningHoursProductGroup,
  multiEditOpeningHoursSubmit,
  openingHoursLoad,
  openingHoursSubmit,
  removeUnchangedSpecialOpeningHours,
  resetSpecialOpeningHours,
  specialOpeningHoursChangedFirstTime,
  specialOpeningHoursFirstDaySelected,
  specialOpeningHoursSecondDaySelected,
  updateOpeningHours,
  updateSavingStatus
} from './actions/brand-product-group-opening-hours.actions';
import {
  closeSelectedSpecialOpeningHours,
  updateSelectedSpecialOpeningHours
} from './actions/selected-opening-hours.action';
import * as fromOpeningHours from './reducers';
import { selectBrandProductGroupOpeningHoursState } from './selectors';
import { MultiSelectOfferedServiceIds } from '../../services/service/models/multi-select.model';

@Injectable({ providedIn: 'root' })
export class OpeningHoursActionService {
  private actualHours: Hours = {
    standardOpeningHours: [],
    specialOpeningHours: []
  };

  constructor(private store: Store<fromOpeningHours.State>) {
    this.store
      .pipe(select(selectBrandProductGroupOpeningHoursState))
      .subscribe((hours: Hours) => (this.actualHours = hours));
  }

  dispatchLoadOpeningHours(
    outletId: string,
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number
  ): void {
    this.store.dispatch(
      openingHoursLoad({
        outletId: outletId,
        productCategoryId: productCategoryId,
        serviceId: serviceId,
        serviceCharacteristicId: serviceCharacteristicId
      })
    );
  }

  dispatchMultiEditOpeningHoursSubmit(
    multiSelectOfferedServices: MultiSelectOfferedServiceIds[],
    event?: TaskFooterEvent
  ): void {
    this.store.dispatch(
      multiEditOpeningHoursSubmit({
        hours: {
          standardOpeningHours: this.actualHours.standardOpeningHours,
          specialOpeningHours: this.actualHours.specialOpeningHours
        },
        multiSelectOfferedServices: multiSelectOfferedServices,
        taskData: event?.payload
      })
    );
  }

  dispatchOpeningHoursSubmit(outletId: string, service: any, event?: TaskFooterEvent): void {
    this.store.dispatch(
      openingHoursSubmit({
        hours: {
          standardOpeningHours: this.actualHours.standardOpeningHours,
          specialOpeningHours: this.actualHours.specialOpeningHours
        },
        businessSiteId: outletId,
        service: service,
        taskData: event?.payload
      })
    );
  }

  dispatchSpecialOpeningHoursFirstDaySelected(date: number): void {
    this.store.dispatch(specialOpeningHoursFirstDaySelected({ date }));
  }

  dispatchSpecialOpeningHoursSecondDaySelected(
    creationDate: number,
    firstDateSelected: number,
    secondDateSelected: number
  ): void {
    this.store.dispatch(
      specialOpeningHoursSecondDaySelected({
        creationDate: creationDate,
        firstDateSelected: firstDateSelected,
        secondDateSelected: secondDateSelected
      })
    );
  }

  dispatchRemoveUnchangedSpecialOpeningHours(): void {
    this.store.dispatch(removeUnchangedSpecialOpeningHours());
  }

  dispatchSpecialOpeningHoursChangedFirstTime(date: number, hours: Hours): void {
    this.store.dispatch(specialOpeningHoursChangedFirstTime({ date, hours }));
  }

  dispatchDeleteSpecialOpeningHours(date: number): void {
    this.store.dispatch(deleteSpecialOpeningHours({ date }));
  }

  dispatchResetSpecialOpeningHours(
    startDate: number,
    restrictedBrands: string[],
    restrictedProductGroups: string[]
  ): void {
    this.store.dispatch(
      resetSpecialOpeningHours({
        date: startDate,
        restrictedBrands: restrictedBrands,
        restrictedProductGroups: restrictedProductGroups
      })
    );
  }

  dispatchDetachProductGroupFromBrand(
    brandId: string,
    productGroupId: string,
    startDate?: number
  ): void {
    this.store.dispatch(detachProductGroupFromBrand({ brandId, productGroupId, startDate }));
  }

  dispatchDropProductGroupColumn(
    brandId: string,
    productGroupId: string,
    startDate?: number
  ): void {
    this.store.dispatch(dropProductGroupColumn({ brandId, productGroupId, startDate }));
  }

  dispatchMoveStandardOpeningHoursProductGroup(
    brandId: string,
    productGroupId: string,
    direction: Direction
  ): void {
    this.store.dispatch(
      moveStandardOpeningHoursProductGroup({
        brandId,
        productGroupId,
        direction
      })
    );
  }

  dispatchMoveSpecialOpeningHoursProductGroup(
    brandId: string,
    productGroupId: string,
    startDate: number,
    direction: Direction
  ): void {
    this.store.dispatch(
      moveSpecialOpeningHoursProductGroup({
        brandId,
        productGroupId,
        startDate,
        direction
      })
    );
  }

  dispatchUpdateOpeningHours(date: number, hours: Hours): void {
    this.store.dispatch(updateOpeningHours({ date: date, hours: formatHours(hours) }));
  }

  dispatchUpdateSelectedSpecialOpeningHours(startDate: number): void {
    this.store.dispatch(updateSelectedSpecialOpeningHours({ startDate }));
  }

  dispatchCloseSelectedSpecialOpeningHours(): void {
    this.store.dispatch(closeSelectedSpecialOpeningHours());
  }

  dispatchUpdateSavingStatus(updated: boolean): void {
    this.store.dispatch(updateSavingStatus({ updated }));
  }

  dispatchInitMultiEditOpeningHours(payload: { hours: Hours }): void {
    this.store.dispatch(initMultiEditOpeningHours(payload));
  }
}
