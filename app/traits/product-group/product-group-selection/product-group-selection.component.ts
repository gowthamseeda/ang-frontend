import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { combineLatest, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductGroup } from '../../../services/product-group/product-group.model';
import { ProductGroupService } from '../../../services/product-group/product-group.service';

@Component({
  selector: 'gp-product-group-selection',
  templateUrl: './product-group-selection.component.html',
  styleUrls: ['./product-group-selection.component.scss']
})
export class ProductGroupSelectionComponent implements OnInit, OnDestroy {
  @Input()
  control: UntypedFormControl;
  @Input()
  readonly: Boolean = false;
  @Input()
  placeholder: string;
  @Input()
  required = true;
  @Input()
  focusEnabled = false;
  @Input()
  externalKeyDownload = false;
  @Output()
  selectionChange = new EventEmitter<string>();

  restrictedProductGroups: ProductGroup[] = [];
  selectedProductGroup: ProductGroup | undefined;

  private unsubscribe = new Subject<void>();
  constructor(private productGroupService: ProductGroupService) {}

  ngOnInit(): void {
    const productGroupOfControl = this.control?.value
      ? this.productGroupService.get(this.control.value)
      : of(undefined);

    combineLatest([
      productGroupOfControl,
      this.productGroupService.getAllForUserDataRestrictions(this.focusEnabled)
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([selectedProductGroup, restrictedProductGroups]) => {
        this.selectedProductGroup = selectedProductGroup;
        this.restrictedProductGroups = restrictedProductGroups;
      });
  }

  get productGroups(): ProductGroup[] {
    if (
      this.selectedProductGroup === undefined ||
      this.restrictedProductGroups.find(
        productGroup => productGroup.id === this.selectedProductGroup?.id
      )
    ) {
      return this.restrictedProductGroups;
    }

    return this.restrictedProductGroups.concat(this.selectedProductGroup);
  }

  onChange(changeEvent: MatSelectChange): void {
    this.selectionChange.emit(changeEvent.value);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
