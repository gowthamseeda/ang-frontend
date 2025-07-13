import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import {
  MultiSelect,
  MultiSelectMode,
  MultiSelectOfferedService,
  MultiSelectOfferedServiceIds,
  MultiSelectOfferedServiceList
} from '../models/multi-select.model';
import { OfferedService } from "../../offered-service/offered-service.model";

@Injectable({
  providedIn: 'root'
})
export class MultiSelectDataService {
  private readonly _pristine = new BehaviorSubject<MultiSelect>({
    targets: [],
    mode: MultiSelectMode.EDIT,
    offeredServiceSelectionList: []
  });

  private readonly _copyStatus = new BehaviorSubject<boolean>(false);

  get multiSelected(): Observable<MultiSelect> {
    return this._pristine.asObservable();
  }

  get isTargetsEmpty(): Observable<boolean> {
    return this._pristine.pipe(
      take(1),
      mergeMap(data => iif(() => data.targets.length === 0, of(true), of(false)))
    );
  }

  get mode(): Observable<MultiSelectMode> {
    return this._pristine.pipe(
      take(1),
      map(data => data.mode)
    );
  }

  replaceOfferedServiceSelectionList(offeredServices: OfferedService[], outletId: string): void {
    this._pristine.value.offeredServiceSelectionList = [];

    offeredServices.forEach(offeredService => {
      this._pristine.value.offeredServiceSelectionList.push(
        {
          id: offeredService.id,
          serviceId: offeredService.serviceId,
          brandId: offeredService.brandId,
          productGroupId: offeredService.productGroupId,
          productCategoryId: offeredService.productCategoryId,
          outletId: outletId
        }
      )
    })
  }

  updateMode(mode: MultiSelectMode): void {
    this._pristine.value.mode = mode;
  }

  isTarget(id: string): Observable<boolean> {
    return this._pristine.pipe(
      take(1),
      mergeMap(data => iif(() => data.targets.some(e => e.id === id), of(true), of(false)))
    );
  }

  addTarget(target: MultiSelectOfferedServiceIds): void {
    if (!this._pristine.value.targets.some(e => e.id === target.id)) {
      this._pristine.value.targets.push(target);
    }
  }

  removeTarget(target: MultiSelectOfferedServiceIds): void {
    this._pristine.value.targets = this._pristine.value.targets.filter(value => {
      return value.id !== target.id;
    });
  }

  //flush unwanted multi edit target that might persist after outlet change
  flushTargetBy(outletId:String){
    this._pristine.value.targets = this._pristine.value.targets.filter(value => {
      return value.outletId == outletId;
    });
    this.updateStatus(this._pristine.value.targets.length > 0);
  }

  flush(): void {
    this._pristine.next({
      targets: [],
      mode: MultiSelectMode.EDIT,
      offeredServiceSelectionList: []
    });
  }

  selectBrand(brandId: string) {
    const targets = this._pristine.value.targets;
    const hasMatchingBrandId = targets.some(target => target.brandId === brandId);

    if (hasMatchingBrandId) {
      this._pristine.value.targets = targets.filter(target => target.brandId !== brandId);
    } else {
      this._pristine.value.offeredServiceSelectionList
        .filter(target => target.brandId == brandId)
        .forEach(offeredService => {
          this.addTarget(
            {
              id: offeredService.id,
              serviceId: offeredService.serviceId,
              brandId: offeredService.brandId,
              productGroupId: offeredService.productGroupId,
              productCategoryId: offeredService.productCategoryId,
              outletId: offeredService.outletId
            }
          )
      })
    }
  }

  selectServiceId(serviceId: number) {
    const targets = this._pristine.value.targets;
    const hasMatchingServiceId = targets.some(target => target.serviceId === serviceId);

    if (hasMatchingServiceId) {
      this._pristine.value.targets = targets.filter(target => target.serviceId !== serviceId);
    } else {
      this._pristine.value.offeredServiceSelectionList
        .filter(target => target.serviceId == serviceId)
        .forEach(offeredService => {
          this.addTarget(
            {
              id: offeredService.id,
              serviceId: offeredService.serviceId,
              brandId: offeredService.brandId,
              productGroupId: offeredService.productGroupId,
              productCategoryId: offeredService.productCategoryId,
              outletId: offeredService.outletId
            }
          )
        })
    }
  }

  selectBrandProductGroupId(brandId: string, productGroupId: string) {
    const targets = this._pristine.value.targets;
    const hasMatchingBrandProductGroup = targets.some(target =>
      target.brandId === brandId && target.productGroupId === productGroupId
    );

    if (hasMatchingBrandProductGroup) {
      this._pristine.value.targets = targets.filter(target =>
        !(target.brandId === brandId && target.productGroupId === productGroupId)
      );
    } else {
      this._pristine.value.offeredServiceSelectionList
        .filter(targets => targets.productGroupId === productGroupId && targets.brandId === brandId)
        .forEach(offeredService => {
          this.addTarget({
            id: offeredService.id,
            serviceId: offeredService.serviceId,
            brandId: offeredService.brandId,
            productGroupId: offeredService.productGroupId,
            productCategoryId: offeredService.productCategoryId,
            outletId: offeredService.outletId
          });
      });
    }
  }

  get copyStatus(): Observable<boolean> {
    return this._copyStatus.asObservable();
  }

  updateStatus(status: boolean): void {
    this._copyStatus.next(status);
  }

  private readonly _hoveredService = new BehaviorSubject<number | null>(null);

  get hoveredService(): Observable<number | null> {
    return this._hoveredService.asObservable();
  }

  updateHoveredService(serviceId?: number): void {
    if (serviceId) {
      this._hoveredService.next(serviceId);
    } else {
      this._hoveredService.next(null);
    }
  }

  flushHoveredService(): void {
    this._hoveredService.next(null);
  }

  private readonly _multiSelectOfferedServiceList =
    new BehaviorSubject<MultiSelectOfferedServiceList>({
      offeredServiceAddedList: [],
      offeredServiceChangedList: [],
      offeredServiceRemovedList: []
    });

  get multiSelectOfferedServiceList(): Observable<MultiSelectOfferedServiceList> {
    return this._multiSelectOfferedServiceList.asObservable();
  }

  addOfferedServiceToList(offeredService: MultiSelectOfferedService): void {
    if (
      this._multiSelectOfferedServiceList.value.offeredServiceRemovedList.some(
        e => e.id === offeredService.id && e.validity === offeredService.validity
      )
    ) {
      this.removeOfferedServiceFromRemovedList(offeredService);
    } else {
      this.addOfferedServiceToAddedList(offeredService);
    }
  }

  removeOfferedServiceFromList(offeredService: MultiSelectOfferedService): void {
    if (
      this._multiSelectOfferedServiceList.value.offeredServiceAddedList.some(
        e => e.id === offeredService.id && e.validity === offeredService.validity
      )
    ) {
      this.removeOfferedServiceFromAddedList(offeredService);
    } else {
      this.addOfferedServiceToRemovedList(offeredService);
    }
  }

  addOfferedServiceToAddedList(offeredService: MultiSelectOfferedService): void {
    if (
      !this._multiSelectOfferedServiceList.value.offeredServiceAddedList.some(
        e => e.id === offeredService.id
      )
    ) {
      this._multiSelectOfferedServiceList.value.offeredServiceAddedList.push(offeredService);
    }
  }

  addOfferedServiceToRemovedList(offeredService: MultiSelectOfferedService): void {
    if (
      !this._multiSelectOfferedServiceList.value.offeredServiceRemovedList.some(
        e => e.id === offeredService.id
      )
    ) {
      this._multiSelectOfferedServiceList.value.offeredServiceRemovedList.push(offeredService);
    }
  }

  removeOfferedServiceFromAddedList(offeredService: MultiSelectOfferedService): void {
    this._multiSelectOfferedServiceList.value.offeredServiceAddedList =
      this._multiSelectOfferedServiceList.value.offeredServiceAddedList.filter(value => {
        return value.id !== offeredService.id;
      });
  }

  removeOfferedServiceFromRemovedList(offeredService: MultiSelectOfferedService): void {
    this._multiSelectOfferedServiceList.value.offeredServiceRemovedList =
      this._multiSelectOfferedServiceList.value.offeredServiceRemovedList.filter(value => {
        return value.id !== offeredService.id;
      });
  }

  flushMultiSelectOfferedServiceList(): void {
    this._multiSelectOfferedServiceList.next({
      offeredServiceAddedList: [],
      offeredServiceChangedList: [],
      offeredServiceRemovedList: []
    });
  }
}
