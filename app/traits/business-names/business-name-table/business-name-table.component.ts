import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskFooterEvent } from 'app/tasks/task.model';
import { ObservableInput } from 'ngx-observable-input';
import { indexBy, map as ramdaMap, prop } from 'ramda';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  finalize,
  ignoreElements,
  map,
  startWith,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';

import { Brand } from '../../../services/brand/brand.model';
import { BrandService } from '../../../services/brand/brand.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { flatten } from '../../../shared/util/arrays';
import { SubmitIndependentErrorStateMatcher } from '../../../shared/validators/error-state-matchers/submit-independent-error-state-matcher';
import { BusinessNameChanges, BusinessNamesChangeTracker } from '../business-names-change-tracker';
import { FlatBusinessName, GroupedBusinessName } from '../business-names.model';
import { BusinessNamesService } from '../business-names.service';

import { BusinessNameTable } from './business-name-table';
import { BusinessNameTableService } from './business-name-table.service';

@Component({
  selector: 'gp-business-name-table',
  templateUrl: './business-name-table.component.html',
  styleUrls: ['./business-name-table.component.scss']
})
export class BusinessNameTableComponent implements OnChanges, OnDestroy {
  @Input()
  @ObservableInput()
  outletId: Observable<string>;
  @Input()
  @ObservableInput()
  disabled: Observable<boolean>;
  @Input()
  currentLanguage: string | null;
  @Input()
  countryLanguages: string[];
  @Input()
  defaultLanguageId: string;
  @Input()
  isInTranslationEditMode: boolean;
  sort: any;
  @Output()
  hasChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(MatSort)
  set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sortingDataAccessor = (item: UntypedFormControl, property: string) =>
        item.value[property];
      this.dataSource.sort = this.sort;
    }
  }

  displayedColumns: string[] = ['name', 'brands', 'actions'];
  submitInProgress = false;
  availableBrandIds: string[] = [];
  currentOutletId: string;
  _disabled: boolean;
  dataSource = new MatTableDataSource<AbstractControl>([]);
  errorStateMatcher = new SubmitIndependentErrorStateMatcher();
  changeTrackers: BusinessNamesChangeTracker[] = [];
  businessNamesRows: UntypedFormArray;
  businessNamesForm: UntypedFormGroup;

  private unsubscribe = new Subject<void>();

  constructor(
    private businessNameService: BusinessNamesService,
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private brandService: BrandService,
    private snackBarService: SnackBarService,
    private businessNameTableService: BusinessNameTableService
  ) {}

  ngOnChanges(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initialize(): void {
    this.initAvailableBrandIds();
    this.prepareTable();

    this.getTableData()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([businessNames, disabled]) => {
        this._disabled = disabled;
        this.initTable(businessNames);
      });
  }

  addNewRow(): void {
    this.addRow(new GroupedBusinessName());
  }

  isAddButtonDisabled(): boolean {
    const emptyRowExists = BusinessNameTable.emptyRowExists(this.businessNamesRows);
    const allAvailableBrandIdsSelected = BusinessNameTable.allAvailableBrandIdsSelected(
      this.availableBrandIds,
      this.businessNamesRows
    );

    return (
      this.businessNamesRows.invalid ||
      this._disabled ||
      emptyRowExists ||
      allAvailableBrandIdsSelected
    );
  }

  showDeleteConfirmationDialog(row: UntypedFormGroup): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: 'DELETE_ENTRY',
        content: 'DELETE_ENTRY_QUESTION',
        confirmButton: 'YES'
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(confirmed => {
        if (confirmed) {
          BusinessNameTable.deleteRow(row);
          this.emitChange();
        }
      });
  }

  save(): void {
    const allChanges = this.allChanges();
    this.businessNameService
      .save(this.currentOutletId, allChanges[0], allChanges[1], allChanges[2])
      .pipe(
        ignoreElements(),
        finalize(() => {
          this.submitInProgress = false;
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {},
        error => {
          this.snackBarService.showError(error);
        },
        () => {
          this.snackBarService.showInfo('EDIT_BUSINESS_NAMES_UPDATE_SUCCESS');
          this.businessNameTableService.namesSaved(true);
          this.refreshTable();
        }
      );
  }

  confirmSave(taskEvent?: TaskFooterEvent): Observable<any> {
    const allChanges = this.allChanges(taskEvent);

    if (allChanges[0].length === 0 && allChanges[1].length === 0 && allChanges[2].length === 0) {
      return this.businessNameService.emptyRequest(this.currentOutletId, taskEvent?.payload);
    }

    return this.businessNameService
      .save(this.currentOutletId, allChanges[0], allChanges[1], allChanges[2])
      .pipe(
        ignoreElements(),
        finalize(() => {
          this.submitInProgress = false;
          this.refreshTable();
        })
      );
  }

  resetSubmitInProgress(): void {
    this.submitInProgress = false;
  }

  allChanges(taskEvent?: TaskFooterEvent): Array<FlatBusinessName[]> {
    this.submitInProgress = true;

    const allChanges: BusinessNameChanges[] = this.changeTrackers.map(tracker =>
      tracker.allChanges(taskEvent?.payload)
    );

    const creates: FlatBusinessName[] = allChanges
      .map(change => change.creates)
      .reduce(flatten, []);
    const updates: FlatBusinessName[] = allChanges
      .map(change => change.updates)
      .reduce(flatten, []);
    const deletes: FlatBusinessName[] = allChanges
      .map(change => change.deletes)
      .reduce(flatten, []);

    return [creates, updates, deletes];
  }

  reset(): void {
    this.initialize();
  }

  isDirty(): boolean {
    return this.businessNamesForm.dirty;
  }

  isInvalid(): boolean {
    return this.businessNamesForm.invalid || this.submitInProgress;
  }

  isInvalidOrPristine(): boolean {
    return this.isInvalid() || this.businessNamesForm.pristine;
  }

  filteredBrandIds(businessNameRow: AbstractControl): string[] {
    const currentBrandIds = businessNameRow.value.brands.map((brand: any) => brand.brandId);

    return BusinessNameTable.selectedBrandIds(this.businessNamesRows).filter(
      brandId => !currentBrandIds.includes(brandId)
    );
  }

  getInputFormControl(businessNameRow: UntypedFormGroup): AbstractControl | null {
    const translationControl = (businessNameRow.get('translations') as UntypedFormArray).controls.find(
      (control: UntypedFormGroup) => {
        return control.value.languageId === this.currentLanguage;
      }
    );

    if (translationControl !== undefined) {
      return translationControl.get('name');
    }

    return businessNameRow.get('name');
  }

  hasReadonlyBrand(businessNameRow: UntypedFormGroup): boolean {
    return GroupedBusinessName.hasReadonlyBrand(businessNameRow.value);
  }

  private initAvailableBrandIds(): void {
    this.brandService
      .getAllForUserDataRestrictions()
      .pipe(
        take(1),
        map((brands: Brand[]) => (this.availableBrandIds = brands.map(brand => brand.id)))
      )
      .subscribe();
  }

  private prepareTable(): void {
    this.dataSource = new MatTableDataSource<AbstractControl>([]);
    this.dataSource.filter = 'deleted';
    this.dataSource.filterPredicate = (data: AbstractControl) => !data.value.deleted;

    this.initFormGroup();
  }

  private initFormGroup(): void {
    this.changeTrackers = [];
    this.businessNamesRows = this.formBuilder.array([]);
    this.businessNamesForm = this.formBuilder.group({ businessNames: this.businessNamesRows });
    this.businessNamesForm.reset();

    this.businessNamesRows.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.dataSource.data = this.businessNamesRows.controls;
    });

    this.businessNamesForm.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.emitChange();
    });
  }

  private emitChange(): void {
    // Set timeout so that changes child components are propagated to the parent. The current status like dirty or pristine
    // is available only after one tick.
    setTimeout(() => {
      if (this.businessNamesForm.dirty) {
        this.hasChange.emit(true);
      }
    });
  }

  private getTableData(): Observable<[GroupedBusinessName[], boolean]> {
    return this.outletId.pipe(
      switchMap((outletId: string) => {
        this.currentOutletId = outletId;
        this.businessNameService.clearCache(outletId);

        return combineLatest([
          this.businessNameService.get(outletId),
          this.disabled.pipe(startWith(false))
        ]);
      })
    );
  }

  private initTable(businessNames: GroupedBusinessName[]): void {
    this.initFormGroup();
    businessNames.forEach(businessName => this.addRow(businessName));
  }

  private addRow(businessName: GroupedBusinessName): void {
    if (!BusinessNameTable.emptyRowExists(this.businessNamesRows)) {
      if (this.invalidRowsExists()) {
        this.showValidationMessages();
      } else {
        const row = this.toFormGroup(
          businessName,
          [Validators.required, Validators.maxLength(256)],
          [Validators.required]
        );

        if (businessName.readonly || this._disabled) {
          row.disable();
        }

        this.addChangeTracker(row);
        this.businessNamesRows.push(row);
      }
    }
  }

  private addChangeTracker(businessNameRow: UntypedFormGroup): void {
    const changeTracker = new BusinessNamesChangeTracker(
      businessNameRow.value as GroupedBusinessName
    );
    businessNameRow.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((newState: GroupedBusinessName) => {
        changeTracker.currentState = newState;
      });

    this.changeTrackers.push(changeTracker);
  }

  private toTranslationFormGroup(languageId: string, businessName: GroupedBusinessName): UntypedFormGroup {
    const translationName =
      businessName.translations !== undefined && businessName.translations[languageId] !== undefined
        ? businessName.translations[languageId]
        : '';

    return this.formBuilder.group({
      name: [translationName, Validators.maxLength(256)],
      languageId: [languageId]
    });
  }

  private toFormGroup(
    businessName: GroupedBusinessName,
    businessNameValidators: ValidatorFn[],
    brandIdsValidators: ValidatorFn[]
  ): UntypedFormGroup {
    const translationControls = this.formBuilder.array([]);

    if (this.countryLanguages) {
      this.countryLanguages
        .filter((languageId: string) => languageId !== this.defaultLanguageId)
        .forEach((languageId: string) => {
          translationControls.push(this.toTranslationFormGroup(languageId, businessName));
        });
    }

    return this.formBuilder.group({
      name: [businessName.name, businessNameValidators],
      translations: translationControls,
      brands: [businessName.brands, brandIdsValidators],
      deleted: [businessName.deleted],
      readOnly: [businessName.readonly]
    });
  }

  private refreshTable(): void {
    const businessNames: GroupedBusinessName[] = [];
    this.businessNamesRows.value
      .filter((businessName: GroupedBusinessName) => !businessName.deleted)
      .forEach((businessNameRow: any) => {
        businessNames.push(
          new GroupedBusinessName(
            businessNameRow.name,
            businessNameRow.brands,
            ramdaMap(prop('name'), indexBy(prop('languageId'), businessNameRow.translations)),
            businessNameRow.readOnly
          )
        );
      });
    this.initTable(businessNames);
  }

  private invalidRowsExists(): boolean {
    return this.businessNamesRows.controls.some(
      (businessNameRow: UntypedFormGroup) => businessNameRow.invalid
    );
  }

  private showValidationMessages(): void {
    this.businessNamesRows.controls
      .filter((keyRow: UntypedFormGroup) => keyRow.invalid)
      .forEach((keyRow: UntypedFormGroup) => {
        ['name', 'brands'].forEach((controlName: string) =>
          BusinessNameTable.controlByName(keyRow, controlName).markAsTouched()
        );
      });
  }
}
