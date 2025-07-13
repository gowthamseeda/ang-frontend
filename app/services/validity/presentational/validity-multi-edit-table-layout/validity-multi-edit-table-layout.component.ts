import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import {
  BrandProductGroup,
  BrandProductGroupsGroupedByBrandId
} from 'app/services/brand-product-group/brand-product-group.model';
import moment from 'moment';
import { ObservableInput } from 'ngx-observable-input';
import { uniq } from 'ramda';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { brandProductGroupUtils } from '../../../brand-product-group/brand-product-group.model';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { MultiSelectDataService } from '../../../service/services/multi-select-service-data.service';
import { getMultiEditOfferedServiceCurrentProcessState } from '../../../shared/util/multi-edit-offered-service-process-state';
import { ValidityChange, ValidityTableRow } from '../../validity.model';

@Component({
  selector: 'gp-validity-multi-edit-table-layout',
  templateUrl: './validity-multi-edit-table-layout.component.html',
  styleUrls: ['./validity-multi-edit-table-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidityMultiEditTableLayoutComponent implements OnInit, OnDestroy {
  @Input() countryId: string;
  @Input() brandProductGroups: BrandProductGroupsGroupedByBrandId;
  @Input()
  @ObservableInput()
  validityTableRows: Observable<ValidityTableRow[]>;
  @Input()
  @ObservableInput()
  validityTableIsPristine: Observable<boolean>;
  @Input() userHasPermissions: boolean;
  @Input() brandRestrictions: string[];
  @Input() productGroupRestrictions: string[];
  @Output() applicationChange = new EventEmitter<ValidityChange>();
  @Output() applicationUntilChange = new EventEmitter<ValidityChange>();
  @Output() validFromChange = new EventEmitter<ValidityChange>();
  @Output() validUntilChange = new EventEmitter<ValidityChange>();
  @Output() validityChange = new EventEmitter<ValidityChange>();
  @Output() pristineChange = new EventEmitter<boolean>();
  @Output() validChange = new EventEmitter<boolean>();

  validityTableForm: UntypedFormGroup;
  validityDataSource = new MatTableDataSource<ValidityTableRow>([]);
  displayedColumns = ['application', 'validity', 'offeredServices'];

  private isValidityTableValid = true;
  private unsubscribe = new Subject<void>();

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: UntypedFormBuilder,
    private localeService: LocaleService,
    private multiSelectDataService: MultiSelectDataService
  ) {}

  get validityFormArray(): UntypedFormArray {
    return this.validityTableForm.get('validities') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.setDatePickerFormat();
    this.initialize();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initialize(): void {
    this.validityTableForm = this.formBuilder.group({
      validities: this.formBuilder.array([])
    });

    this.validityTableRows.pipe(takeUntil(this.unsubscribe)).subscribe(validityTableRows => {
      this.validityDataSource.data = validityTableRows;
      this.initValidityFormTable();
    });

    /*
     * Prevent statusChanges from emitting values too often
     * */
    this.validityTableForm.statusChanges
      .pipe(debounceTime(500), takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.isValidityTableValid = status === 'VALID';
        this.validChange.emit(this.isValidityTableValid);
      });
  }

  offeredServiceValidityExistsFor(
    rowIndex: number,
    brandId: string,
    productGroupId: string
  ): boolean {
    const offeredServices = this.getOfferedServicesFor(rowIndex);

    return offeredServices.some(
      (offeredService: OfferedService) =>
        offeredService.brandId === brandId && offeredService.productGroupId === productGroupId
    );
  }

  isValidityRowDisabled(validityTableRow: ValidityTableRow): boolean {
    const { offeredServicesMap } = validityTableRow;
    if (!this.userHasPermissions) {
      return true;
    }

    const restrictedBrandProductGroups = this.getRestrictedBrandProductGroups();
    const brandProductGroupsInCurrentValidityRow =
      this.getCurrentBrandProductGroupsOfValidityRow(offeredServicesMap);

    let isDisabled = false;

    brandProductGroupsInCurrentValidityRow.forEach(brandProductGroup => {
      if (!restrictedBrandProductGroups.includes(brandProductGroup)) {
        isDisabled = true;
      }
    });

    return isDisabled;
  }

  emitApplicationChange(checkboxChecked: boolean, rowIndex: number): void {
    if (checkboxChecked === undefined) {
      return;
    }
    const validityTableRow = this.validityDataSource.data[rowIndex];
    const ids = this.offeredServiceIdsOfValidityTableRow(rowIndex);

    this.applicationChange.emit({
      ids,
      validity: {
        application: checkboxChecked
      },
      rowIndex
    } as ValidityChange);

    if (!checkboxChecked && validityTableRow.applicationValidUntil) {
      this.applicationUntilChange.emit({
        ids,
        validity: {
          applicationValidUntil: undefined
        }
      } as ValidityChange);
    }
    this.pristineChange.emit(false);
  }

  emitApplicationUntilChange(date: Date, rowIndex: number): void {
    const applicationValidUntil = this.dateAsString(date);
    const ids = this.offeredServiceIdsOfValidityTableRow(rowIndex);

    if (!applicationValidUntil) {
      this.applicationUntilChange.emit({ ids, undefined } as ValidityChange);
      this.pristineChange.emit(false);
      return;
    }

    this.applicationUntilChange.emit({
      ids,
      validity: {
        applicationValidUntil
      },
      rowIndex
    } as ValidityChange);
    this.setValidFromByApplicant(rowIndex, ids, applicationValidUntil);
    this.pristineChange.emit(false);
  }

  emitValidFromChange(datepickerInputEvent: MatDatepickerInputEvent<Date>, rowIndex: number): void {
    const validFrom = this.dateAsString(datepickerInputEvent.value);
    const ids = this.offeredServiceIdsOfValidityTableRow(rowIndex);

    if (!validFrom) {
      this.validFromChange.emit({
        ids,
        validity: {
          validFrom: undefined
        },
        rowIndex
      });

      this.validityFormArray.at(rowIndex)?.patchValue({
        validUntil: undefined
      });

      this.validUntilChange.emit({
        ids,
        validity: {
          validUntil: undefined
        }
      } as ValidityChange);
      this.pristineChange.emit(false);
      return;
    }

    this.validFromChange.emit({
      ids,
      validity: {
        validFrom
      },
      rowIndex
    } as ValidityChange);
    this.pristineChange.emit(false);
  }

  emitValidUntilChange(
    datepickerInputEvent: MatDatepickerInputEvent<Date>,
    rowIndex: number
  ): void {
    const validUntil = this.dateAsString(datepickerInputEvent.value);

    const ids = this.offeredServiceIdsOfValidityTableRow(rowIndex);

    if (!validUntil) {
      this.validUntilChange.emit({ ids, undefined } as ValidityChange);
    }

    this.validUntilChange.emit({
      ids,
      validity: {
        validUntil
      },
      rowIndex
    } as ValidityChange);
    this.pristineChange.emit(false);
  }

  calculateBrandsColumnWidth(brandId: string): string {
    const borderWidth = 1;
    const columnWidth = 60;
    return `${columnWidth * this.brandProductGroups[brandId].length + borderWidth}px`;
  }

  getIcon(
    rowIndex: number,
    brandId: string,
    productGroupId: string
  ): Observable<string | undefined> {
    return this.multiSelectDataService.hoveredService.pipe(
      map(hoveredServiceId => {
        const isAssignable = this.offeredServiceValidityExistsFor(
          rowIndex,
          brandId,
          productGroupId
        );

        if (!isAssignable) {
          return '';
        }

        const offeredServices = this.getOfferedServicesFor(rowIndex);

        const offeredService = offeredServices.filter(
          it => it.brandId === brandId && it.productGroupId === productGroupId
        );

        const serviceHovered = offeredService.some(it => it.serviceId === hoveredServiceId);

        const offeredServiceProcessState = getMultiEditOfferedServiceCurrentProcessState(
          offeredService[0],
          isAssignable
        );

        return serviceHovered
          ? offeredServiceProcessState?.hoverIcon
          : offeredServiceProcessState?.defaultIcon;
      }),
      takeUntil(this.unsubscribe)
    );
  }

  isProductGroupDisabled(brandId: string, productGroupId: string): boolean {
    if (!this.userHasPermissions) {
      return true;
    }
    if (this.brandRestrictions.length > 0 && this.productGroupRestrictions.length > 0) {
      return !(
        this.brandRestrictions.includes(brandId) &&
        this.productGroupRestrictions.includes(productGroupId)
      );
    } else if (this.brandRestrictions.length > 0 && this.productGroupRestrictions.length === 0) {
      return !this.brandRestrictions.includes(brandId);
    } else if (this.brandRestrictions.length === 0 && this.productGroupRestrictions.length > 0) {
      return !this.productGroupRestrictions.includes(productGroupId);
    }
    return false;
  }

  orderBrandProductGroups(brandProductGroups: BrandProductGroup[]): BrandProductGroup[] {
    return brandProductGroupUtils.orderByProductGroupId(brandProductGroups);
  }

  add1Day(date: string | /* YYYY-MM-DD */ null): Date | null {
    if (!date) {
      return null;
    }
    return moment(date).add(1, 'days').toDate();
  }

  subtract1Day(date: string | /* YYYY-MM-DD */ null): Date | null {
    if (!date) {
      return null;
    }
    return moment(date).subtract(1, 'days').toDate();
  }

  private setDatePickerFormat(): void {
    this.localeService
      .currentBrowserLocale()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locale => {
        this.dateAdapter.setLocale(locale);
      });
  }

  private getOfferedServicesFor(rowIndex: number): OfferedService[] {
    return Object.values(this.validityDataSource.data[rowIndex].offeredServicesMap);
  }

  private getRestrictedBrandProductGroups(): string[] {
    let restrictedBrandProductGroups: string[];
    if (this.brandRestrictions.length === 0 && this.productGroupRestrictions.length === 0) {
      restrictedBrandProductGroups = [];
    } else if (this.brandRestrictions.length > 0 && this.productGroupRestrictions.length === 0) {
      restrictedBrandProductGroups = this.brandRestrictions;
    } else if (this.brandRestrictions.length === 0 && this.productGroupRestrictions.length > 0) {
      restrictedBrandProductGroups = this.productGroupRestrictions;
    } else {
      restrictedBrandProductGroups = this.brandRestrictions.reduce(
        (acc, brand) => [
          ...acc,
          ...this.productGroupRestrictions.reduce(
            (innerAcc, productGroup) => [...innerAcc, `${brand}-${productGroup}`],
            []
          )
        ],
        []
      );
    }
    return [...restrictedBrandProductGroups].sort();
  }

  private getCurrentBrandProductGroupsOfValidityRow(offeredServicesMap: {
    [key: string]: OfferedService;
  }): string[] {
    let currentBrandProductGroupsOfValidityRow: string[];
    if (this.brandRestrictions.length === 0 && this.productGroupRestrictions.length === 0) {
      currentBrandProductGroupsOfValidityRow = [];
    } else if (this.brandRestrictions.length > 0 && this.productGroupRestrictions.length === 0) {
      currentBrandProductGroupsOfValidityRow = Object.keys(offeredServicesMap).reduce(
        (acc, key) => [...acc, offeredServicesMap[key].brandId],
        []
      );
    } else if (this.brandRestrictions.length === 0 && this.productGroupRestrictions.length > 0) {
      currentBrandProductGroupsOfValidityRow = Object.keys(offeredServicesMap).reduce(
        (acc, key) => [...acc, offeredServicesMap[key].productGroupId],
        []
      );
    } else {
      currentBrandProductGroupsOfValidityRow = Object.keys(offeredServicesMap).reduce(
        (acc, key) => [
          ...acc,
          `${offeredServicesMap[key].brandId}-${offeredServicesMap[key].productGroupId}`
        ],
        []
      );
    }
    currentBrandProductGroupsOfValidityRow = uniq(currentBrandProductGroupsOfValidityRow).sort();
    return currentBrandProductGroupsOfValidityRow;
  }

  private initValidityFormTable(): void {
    this.validityFormArray.clear();

    this.validityFormArray.push(
      this.formBuilder.group({
        application: false,
        applicationValidUntil: null,
        validFrom: null,
        validUntil: null
      })
    );
    this.validityFormArray.markAllAsTouched();
  }

  private offeredServiceIdsOfValidityTableRow(rowIndex: number): string[] {
    if (!this.validityDataSource.data[rowIndex]) {
      return [];
    }
    const validityTableRow = this.validityDataSource.data[rowIndex];
    return Object.keys(validityTableRow.offeredServicesMap).map(key => key);
  }

  private dateAsString(date: Date | null): string | /* YYYY-MM-DD */ null {
    return date == null ? null : moment(date).format('YYYY-MM-DD');
  }

  private setValidFromByApplicant(
    rowIndex: number,
    ids: string[],
    applicationValidUntil: string
  ): void {
    if (!this.validityFormArray.at(rowIndex)?.get('validFrom')?.value) {
      const validFrom = this.dateAsString(this.add1Day(applicationValidUntil));
      this.validityFormArray.at(rowIndex)?.patchValue({
        validFrom
      });
      this.validFromChange.emit({
        ids,
        validity: {
          validFrom
        },
        rowIndex
      } as ValidityChange);
    }
  }
}
