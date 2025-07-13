import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ServiceVariant } from '../../../../../services/service-variant/service-variant.model';
import {
  MasterServiceVariant,
  MasterServiceVariantUpdate
} from '../../master-service-variant/master-service-variant.model';
import { ServiceVariantConfigure } from '../../models/service-variant-configure.model';

@Component({
  selector: 'gp-service-variant-configure-table',
  templateUrl: './service-variant-configure-table.component.html',
  styleUrls: ['./service-variant-configure-table.component.scss']
})
export class ServiceVariantConfigureTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  selectedServiceVariants: MasterServiceVariant[];
  @Output()
  hasValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  serviceVariantToUpdate: EventEmitter<MasterServiceVariantUpdate[]> = new EventEmitter<
    MasterServiceVariantUpdate[]
  >();

  serviceVariantDataSource = new MatTableDataSource<AbstractControl>([]);
  serviceVariantDisplayedColumns: string[] = [
    'serviceId',
    'brandId',
    'productGroupId',
    'active',
    'actions'
  ];
  serviceVariantsForm: UntypedFormGroup;
  serviceVariantsRows: UntypedFormArray;

  private unsubscribe = new Subject<void>();

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.hasValidChange.emit(false);
    this.prepareTable();
    this.initServiceVariantsTable(this.selectedServiceVariants);
  }

  ngOnChanges(): void {
    this.initServiceVariantsTable(this.selectedServiceVariants);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  addNewServiceVariantRow(): void {
    this.addServiceVariantRow(new ServiceVariantConfigure());
    this.hasValidChange.emit(false);
  }

  removeServiceVariant(row: UntypedFormGroup): void {
    this.serviceVariantsRows.removeAt(
      this.serviceVariantsRows.value.findIndex((arrayRow: any) => row.value === arrayRow)
    );
    this.emitServiceVariant();
  }

  emitServiceVariant(): void {
    const serviceVariants = this.serviceVariantsForm.value
      .serviceVariants as MasterServiceVariantUpdate[];
    this.serviceVariantToUpdate.emit(serviceVariants);
  }

  private prepareTable(): void {
    this.serviceVariantDataSource = new MatTableDataSource<AbstractControl>([]);

    this.initServiceVariantsFormGroup();
  }

  private initServiceVariantsFormGroup(): void {
    this.hasValidChange.emit(false);

    this.serviceVariantsRows = this.formBuilder.array([]);
    this.serviceVariantsForm = this.formBuilder.group({
      serviceVariants: this.serviceVariantsRows
    });
    this.serviceVariantsForm.reset();
    this.serviceVariantDataSource.data = [];
    this.serviceVariantsRows.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.serviceVariantDataSource.data = this.serviceVariantsRows.controls;
    });
  }

  private initServiceVariantsTable(serviceVariants: MasterServiceVariant[]): void {
    this.initServiceVariantsFormGroup();
    serviceVariants.forEach(item => this.addServiceVariantRow(item));

    this.serviceVariantsForm.statusChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.emitValidChange();
    });
    this.emitServiceVariant();
  }

  private addServiceVariantRow(key: ServiceVariantConfigure): void {
    const emptyRowExists =
      this.serviceVariantsRows.value.find(
        (serviceVariant: ServiceVariant) =>
          serviceVariant.serviceId === null ||
          serviceVariant.brandId === null ||
          serviceVariant.productGroupId === null
      ) !== undefined;

    if (emptyRowExists) {
      return;
    }

    const row = this.formBuilder.group({
      serviceId: [key.serviceId, Validators.required],
      brandId: [key.brandId, Validators.required],
      productGroupId: [key.productGroupId, Validators.required],
      active: [key.active]
    });

    this.serviceVariantsRows.push(row);
    this.hasValidChange.emit(true);
  }

  private emitValidChange(): void {
    setTimeout(() => {
      if (this.serviceVariantsForm.invalid) {
        this.hasValidChange.emit(false);
      } else {
        this.hasValidChange.emit(true);
      }
    });
  }
}
