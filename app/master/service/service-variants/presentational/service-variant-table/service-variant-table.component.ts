import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ServiceVariantTable } from '../../models/service-variant.model';
import { ServiceVariantFilterService } from '../../services/service-variant-filter.service';

@Component({
  selector: 'gp-service-variant-table',
  templateUrl: './service-variant-table.component.html',
  styleUrls: ['./service-variant-table.component.scss']
})
export class ServiceVariantTableComponent implements OnDestroy, OnInit, OnChanges {
  @Input() isLoaded: Observable<boolean>;
  @Input() serviceVariantItems: Observable<ServiceVariantTable[]>;
  @Output() selectedServiceVariantIds = new EventEmitter<number[]>();
  @Output() viewServiceVariantId = new EventEmitter<number>();
  @Output() removeServiceVariantId = new EventEmitter<number>();
  @Output() editServiceVariantId = new EventEmitter<number>();

  displayedColumns: string[] = [
    'service',
    'brand',
    'productGroup',
    'active',
    'multiAction',
    'singleAction'
  ];
  displayServiceVariantItems: Observable<ServiceVariantTable[]>;
  searchFormGroup: UntypedFormGroup;
  selection = new SelectionModel<ServiceVariantTable>(true, []);

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private changeDetector: ChangeDetectorRef,
    private serviceVariantFilterService: ServiceVariantFilterService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.initTable();
  }

  ngOnChanges(): void {
    this.initFormGroup();
    this.initTable();
    this.updateTableAndFilter();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onKeyUp(): void {
    const filterValue = this.searchFormGroup.controls['search'].value;
    const isShowSelected = this.searchFormGroup.controls['showSelected'].value;
    const pristineServiceVariant = isShowSelected
      ? of(this.selection.selected.filter(selection => selection.isMultiCheck))
      : this.serviceVariantItems;

    this.displayServiceVariantItems = pristineServiceVariant.pipe(
      map(serviceTableRows => {
        return serviceTableRows.filter(value =>
          value.service.toLowerCase().includes(filterValue.toLowerCase())
        );
      })
    );
  }

  toggle(event: MatCheckboxChange, serviceVariant: ServiceVariantTable): void {
    event.checked ? this.selection.select(serviceVariant) : this.selection.deselect(serviceVariant);
    serviceVariant.isMultiCheck = event.checked;

    this.serviceVariantItems = this.replaceServiceVariant(serviceVariant);
    this.emitServiceVariantId();
    this.updateTableAndFilter();

    this.changeDetector.detectChanges();
  }

  viewServiceVariant(serviceVariantId: number): void {
    this.viewServiceVariantId.emit(serviceVariantId);
  }

  removeServiceVariant(serviceVariantId: number): void {
    this.removeServiceVariantId.emit(serviceVariantId);
  }

  editServiceVariant(serviceVariantId: number): void {
    this.editServiceVariantId.emit(serviceVariantId);
  }

  filterSelectedServiceVariant(isClicked: boolean): void {
    this.searchFormGroup.controls['search'].setValue('');

    const isToggleSelected = isClicked
      ? this.searchFormGroup.controls['showSelected'].value
      : false;

    this.displayServiceVariantItems = this.serviceVariantFilterService.filterSelected(
      this.serviceVariantItems,
      isToggleSelected
    );
  }

  deselectAll(): void {
    this.selection.selected.map(serviceVariants => {
      serviceVariants.isMultiCheck = false;
    });
    this.updateTableAndFilter();
    this.changeDetector.detectChanges();
  }

  updateTableAndFilter(): void {
    const isSelected = this.selection.selected.some(selection => selection.isMultiCheck);

    this.searchFormGroup.controls['multiSelect'].setValue(isSelected);

    if (isSelected) {
      this.searchFormGroup.controls['multiSelect'].enable();
      this.searchFormGroup.controls['showSelected'].enable();
    } else {
      this.searchFormGroup.controls['multiSelect'].disable();
      this.searchFormGroup.controls['showSelected'].disable();
      this.searchFormGroup.controls['showSelected'].setValue(isSelected);
      this.resetDisplayServiceVariant();
    }
  }

  private initTable(): void {
    this.selection.clear();
    this.searchFormGroup?.reset();
    this.displayServiceVariantItems = this.serviceVariantItems;
  }

  private replaceServiceVariant(
    serviceVariant: ServiceVariantTable
  ): Observable<ServiceVariantTable[]> {
    return this.serviceVariantItems.pipe(takeUntil(this.unsubscribe)).pipe(
      map(variantItems => {
        return variantItems.map(item => (item.id === serviceVariant.id ? serviceVariant : item));
      })
    );
  }

  private emitServiceVariantId(): void {
    const serviceVariantIds: number[] = this.selection.selected
      .filter(serviceVariants => serviceVariants.isMultiCheck)
      .map(serviceVariants => {
        return serviceVariants.id;
      });

    this.selectedServiceVariantIds.emit(serviceVariantIds);
  }

  private initFormGroup(): void {
    this.searchFormGroup = this.formBuilder.group({
      search: '',
      multiSelect: { value: false, disabled: true },
      showSelected: { value: false, disabled: true }
    });
  }

  private resetDisplayServiceVariant(): void {
    this.filterSelectedServiceVariant(false);
    this.initTable();
    this.selectedServiceVariantIds.emit([]);
  }
}
