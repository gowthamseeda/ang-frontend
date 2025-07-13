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
import moment, { isMoment } from 'moment';
import { ObservableInput } from 'ngx-observable-input';
import { uniq } from 'ramda';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { brandProductGroupUtils } from '../../../brand-product-group/brand-product-group.model';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { getCurrentProcessState } from '../../../shared/util/offered-service-process-state';
import { Validity, ValidityChange, ValidityTableRow } from '../../validity.model';

enum ArrowDirection {
  UP = 'UP',
  DOWN = 'DOWN'
}

@Component({
  selector: 'gp-validity-table-layout',
  templateUrl: './validity-table-layout.component.html',
  styleUrls: ['./validity-table-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidityTableLayoutComponent implements OnInit, OnDestroy {
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
  @Output() moveValidityUp = new EventEmitter();
  @Output() moveValidityDown = new EventEmitter();
  @Output() pristineChange = new EventEmitter<boolean>();
  @Output() validChange = new EventEmitter<boolean>();

  validityTableForm: UntypedFormGroup;
  validityDataSource = new MatTableDataSource<ValidityTableRow>([]);
  displayedColumns = ['application', 'validity', 'offeredServices'];
  ArrowDirection = ArrowDirection;

  private isValidityTableValid = true;
  private unsubscribe = new Subject<void>();

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: UntypedFormBuilder,
    private localeService: LocaleService
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
      this.initValidityFormTable(validityTableRows);
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

  changeOfferedServiceValidity(
    brandProductGroup: BrandProductGroup,
    arrowDirection: ArrowDirection
  ): void {
    const rowIndexOfOfferedService = this.getRowIndexOfOfferedServiceBy(brandProductGroup);
    const offeredServicesMapOfRow =
      this.validityDataSource.data[rowIndexOfOfferedService].offeredServicesMap;
    const offeredServiceToChangeValidity = Object.values(offeredServicesMapOfRow).find(
      this.hasBrandProductGroup(brandProductGroup)
    );

    if (offeredServiceToChangeValidity !== undefined) {
      const currentValidity = this.getCurrentValidity(rowIndexOfOfferedService);
      let newValidity: Validity | undefined;

      if (arrowDirection === ArrowDirection.UP) {
        newValidity = this.getValidityOfPreviousRow(rowIndexOfOfferedService);
      } else if (arrowDirection === ArrowDirection.DOWN) {
        newValidity = this.getValidityOfNextRow(rowIndexOfOfferedService);
      }

      if (newValidity) {
        const ids = [offeredServiceToChangeValidity.id];

        if (isMoment(newValidity.applicationValidUntil)) {
          newValidity.applicationValidUntil = moment(newValidity.applicationValidUntil).format(
            'YYYY-MM-DD'
          );
        }

        if (isMoment(newValidity.validFrom)) {
          newValidity.validFrom = moment(newValidity.validFrom).format('YYYY-MM-DD');
        }

        if (isMoment(newValidity.validUntil)) {
          newValidity.validUntil = moment(newValidity.validUntil).format('YYYY-MM-DD');
        }

        if (!!newValidity.validFrom) {
          newValidity.valid = moment().isSameOrAfter(newValidity.validFrom);
        }

        this.validityChange.emit({ ids, validity: newValidity } as ValidityChange);
        if (arrowDirection === ArrowDirection.UP) {
          this.moveValidityUp.emit({
            rowIndex: rowIndexOfOfferedService,
            offeredService: offeredServiceToChangeValidity,
            currentValidity,
            newValidity
          });
        } else if (arrowDirection === ArrowDirection.DOWN) {
          this.moveValidityDown.emit({
            rowIndex: rowIndexOfOfferedService,
            offeredService: offeredServiceToChangeValidity,
            currentValidity,
            newValidity
          });
        }
      }
    }

    this.pristineChange.emit(false);
    this.validChange.emit(this.isValidityTableValid);
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
      }
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
      }
    } as ValidityChange);
    this.pristineChange.emit(false);
  }

  offeredServiceIsInFirstRow(brandProductGroup: BrandProductGroup): boolean {
    const rowIndexOfOfferedService = this.getRowIndexOfOfferedServiceBy(brandProductGroup);
    return rowIndexOfOfferedService === 0;
  }

  offeredServiceIsOnlyOneInLastRow(brandProductGroup: BrandProductGroup): boolean {
    const rowIndexOfOfferedService = this.getRowIndexOfOfferedServiceBy(brandProductGroup);
    const countOfferedServicesOfRow = this.countOfferedServicesOfRow(rowIndexOfOfferedService);

    return countOfferedServicesOfRow === 1 && this.isLastRow(rowIndexOfOfferedService);
  }

  calculateBrandsColumnWidth(brandId: string): string {
    const borderWidth = 1;
    const columnWidth = 60;
    return `${columnWidth * this.brandProductGroups[brandId].length + borderWidth}px`;
  }

  getIcon(rowIndex: number, brandId: string, productGroupId: string): string | undefined {
    const isAssignable = this.offeredServiceValidityExistsFor(rowIndex, brandId, productGroupId);

    if (!isAssignable) {
      return '';
    }

    const offeredServices = this.getOfferedServicesFor(rowIndex);
    const offeredService = offeredServices.find(
      it => it.brandId === brandId && it.productGroupId === productGroupId
    );
    const offeredServiceProcessState = getCurrentProcessState(offeredService, isAssignable);

    return offeredServiceProcessState?.icon;
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

  private isLastRow(currentRowIndex: number): boolean {
    return this.validityDataSource.data.length === currentRowIndex + 1;
  }

  private countOfferedServicesOfRow(rowIndex: number): number {
    if (!this.validityDataSource.data[rowIndex]) {
      return 0;
    }
    return Object.keys(this.validityDataSource.data[rowIndex].offeredServicesMap).length;
  }

  private getRowIndexOfOfferedServiceBy(brandProductGroup: BrandProductGroup): number {
    return this.validityDataSource.data.findIndex(validityTableRow =>
      Object.values(validityTableRow.offeredServicesMap).some(
        this.hasBrandProductGroup(brandProductGroup)
      )
    );
  }

  private hasBrandProductGroup(
    brandProductGroup: BrandProductGroup
  ): (offeredService: OfferedService) => boolean {
    return (offeredService: OfferedService) =>
      offeredService.brandId === brandProductGroup.brandId &&
      offeredService.productGroupId === brandProductGroup.productGroupId;
  }

  private getCurrentValidity(currentRowIndex: number): Validity {
    return new Validity(this.validityFormArray.at(currentRowIndex).value);
  }

  private getValidityOfPreviousRow(currentRowIndex: number): Validity | undefined {
    if (currentRowIndex > 0) {
      return new Validity(this.validityFormArray.getRawValue()[currentRowIndex - 1]);
    }
  }

  private getValidityOfNextRow(currentRowIndex: number): Validity {
    if (this.validityDataSource.data.length > currentRowIndex + 1) {
      return new Validity(this.validityFormArray.getRawValue()[currentRowIndex + 1]);
    }

    return new Validity({});
  }

  private initValidityFormTable(validityTableRows: ValidityTableRow[]): void {
    this.validityFormArray.clear();
    validityTableRows.forEach(validityTableRow => {
      const validityFormGroup = this.formBuilder.group({
        application: validityTableRow.application,
        applicationValidUntil: validityTableRow.applicationValidUntil,
        validFrom: validityTableRow.validFrom,
        validUntil: validityTableRow.validUntil
      });
      this.validityFormArray.push(validityFormGroup);
    });
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
