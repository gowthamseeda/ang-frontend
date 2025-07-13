import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ObservableInput } from 'ngx-observable-input';
import { combineLatest, Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

import { Brand as ServicesBrand } from '../../../services/brand/brand.model';
import { BrandService } from '../../../services/brand/brand.service';
import { sortByReference } from '../../../shared/util/arrays';
import { Brand } from '../../brand.model';

@Component({
  selector: 'gp-brand-selection',
  templateUrl: './brand-selection.component.html',
  styleUrls: ['./brand-selection.component.scss']
})
export class BrandSelectionComponent implements OnInit, OnDestroy {
  @Input()
  control: UntypedFormControl;
  @Input()
  placeholder: string;
  @Input()
  readonly = false;
  @Input()
  errorStateMatcher: ErrorStateMatcher;
  @Input()
  onlyRestricted = true;
  @ObservableInput()
  @Input()
  availableBrandIds: Observable<string[]>;
  @ObservableInput()
  @Input()
  excludedBrandIds: Observable<string[]>;
  @Input()
  multiple = true;
  @Input()
  required = true;

  selectableBrands: ServicesBrand[] = [];
  allBrands: ServicesBrand[] = [];
  sortedBrandIds: string[];

  private unsubscribe = new Subject<void>();

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    combineLatest([this.brandService.getAll(), this.getSelectableBrands()])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([allBrands, selectableBrands]) => {
        this.allBrands = allBrands;
        this.sortedBrandIds = allBrands.map(brand => brand.id);
        this.selectableBrands = selectableBrands.concat(
          this.selectedReadonlyBrands(selectableBrands)
        );
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get selectedBrands(): Brand[] {
    if (!this.sortedBrandIds) {
      return [] as Brand[];
    }
    return sortByReference<Brand, Brand>(
      this.getControlValue(),
      this.sortedBrandIds.map(brandId => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.getControlValue().find((brand: Brand) => brand.brandId === brandId)!!;
      }),
      (elem: Brand) => elem
    );
  }

  isDisabled(brand: ServicesBrand): boolean {
    const foundReadonlyBrand = this.getControlValue().find(
      traitsBrand => traitsBrand.brandId === brand?.id && traitsBrand.readonly
    );

    return !!foundReadonlyBrand;
  }

  brandBy(brandId: string): ServicesBrand | undefined {
    return this.allBrands.find(brand => brand.id === brandId);
  }

  traitsBrandBy(brand: ServicesBrand): Brand {
    const brandId = brand?.id ?? '';
    const foundBrand = this.getControlValue().find(
      (traitsBrand: Brand) => traitsBrand.brandId === brandId
    );
    if (foundBrand === undefined) {
      return new Brand(brandId);
    }
    return foundBrand;
  }

  removeBrand(brandIdToRemove: string, clickEvent: Event): void {
    clickEvent.stopPropagation();

    this.setControlValue(
      this.getControlValue().filter((brand: Brand) => brand.brandId !== brandIdToRemove)
    );
    this.control.markAsDirty();
  }

  compareFn(traitsBrand1?: Brand, traitsBrand2?: Brand): boolean {
    return traitsBrand1?.brandId === traitsBrand2?.brandId;
  }

  private selectedReadonlyBrands(brands: ServicesBrand[]): ServicesBrand[] {
    return (
      this.getControlValue()
        .filter(
          (traitsBrand: Brand) =>
            !brands.find((brand: ServicesBrand) => brand.id === traitsBrand.brandId)
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((brand: Brand) => this.brandBy(brand.brandId)!!)
    );
  }

  private getSelectableBrands(): Observable<ServicesBrand[]> {
    return combineLatest([
      this.availableBrandIds.pipe(startWith([])),
      this.excludedBrandIds.pipe(startWith([]))
    ]).pipe(
      switchMap(([availableBrandIds, excludedBrandIds]) =>
        this.brandService.getFilteredBrands(
          excludedBrandIds,
          availableBrandIds,
          this.onlyRestricted
        )
      )
    );
  }

  private getControlValue(): Brand[] {
    if (!this.control.value) {
      return [];
    }

    if (this.control.value instanceof Array) {
      return this.control.value;
    } else {
      return [this.control.value];
    }
  }

  private setControlValue(newValue: Brand[]): void {
    if (this.control.value instanceof Array) {
      this.control.setValue(newValue);
    } else {
      this.control.setValue(newValue[0]);
    }
  }
}
