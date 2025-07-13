import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, ignoreElements, map, take, takeUntil, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { BrandService } from '../../../services/brand/brand.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DefaultEditActions } from '../../../shared/components/default-edit-actions/default-edit-actions.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { flatten, minusFilter } from '../../../shared/util/arrays';
import { SubmitIndependentErrorStateMatcher } from '../../../shared/validators/error-state-matchers/submit-independent-error-state-matcher';
import { Brand } from '../../brand.model';
import { ExternalKey } from '../../external-key/external-key.model';
import { ExternalKeyService } from '../../external-key/external-key.service';
import { ExternalKeyType } from '../external-key-type-selection/external-key-type.model';
import { KeyChanges, KeyChangeTracker } from '../key-change-tracker';
import { KeyType, keyTypeConfigBy } from '../key-type.model';
import { FlatKey, GroupedKey } from '../key.model';
import { KeysService } from '../keys.service';

import { KeyTable } from './key-table';
import { KeyTableService } from './key-table.service';

@Component({
  selector: 'gp-key-table',
  templateUrl: './key-table.component.html',
  styleUrls: ['./key-table.component.scss']
})
export class KeyTableComponent implements OnInit, OnDestroy, DefaultEditActions {
  @Output()
  hasValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  hasChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  set disabled(disabled: boolean) {
    if (disabled !== undefined) {
      this._disabled = disabled;
    }
    if (this.isInitialized) {
      this.initKeys();
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  get outletId(): string {
    return this.localOutletId;
  }
  set outletId(outletId: string) {
    this.localOutletId = outletId;
    if (outletId && this.isInitialized) {
      this.initKeys();
    }
  }

  @Input()
  get countryId(): string {
    return this.localCountryId;
  }
  set countryId(countryId: string) {
    this.localCountryId = countryId;
    if (this.localOutletId && this.localCountryId && this.isInitialized) {
      this.initKeys();
    }
  }

  @Input()
  get focusEnabled(): boolean {
    return this.isFocusEnabled;
  }
  set focusEnabled(focusEnabled: boolean) {
    if (focusEnabled !== undefined) {
      this.isFocusEnabled = focusEnabled;
    }
    if (this.isInitialized) {
      this.initKeys();
    }
  }

  isLoading: boolean;
  isInitialized = false;
  pageElementsLoading = 0;
  displayedColumns: string[] = ['type', 'key', 'brands', 'actions'];
  submitInProgress = false;
  showBrandCodeSyncMessage = false;
  _disabled: boolean;
  dataSource = new MatTableDataSource<AbstractControl>([]);
  errorStateMatcher = new SubmitIndependentErrorStateMatcher();
  changeTrackers: KeyChangeTracker[] = [];
  keysForm: UntypedFormGroup;
  keyRows: UntypedFormArray;
  externalKeysForm: UntypedFormGroup;
  externalKeysRows: UntypedFormArray;
  externalKeysDataSource = new MatTableDataSource<AbstractControl>([]);
  externalKeysDisplayedColumns: string[] = [
    'keyType',
    'value',
    'brandId',
    'productGroupId',
    'actions'
  ];
  readonly = true;
  externalKeysAllowUpdate = true;
  keyTableSort: any;
  externalKeyTableSort: any;

  @ViewChild('keyTable')
  set keyContent(content: ElementRef) {
    this.keyTableSort = content;
    if (this.keyTableSort) {
      this.dataSource.sortingDataAccessor = (item: UntypedFormControl, property: string) =>
        item.value[property];

      this.dataSource.sort = this.keyTableSort;
    }
  }

  @ViewChild('externalKeyTable')
  set externalKeyContent(content: ElementRef) {
    this.externalKeyTableSort = content;
    if (this.externalKeyTableSort) {
      this.externalKeysDataSource.sortingDataAccessor = (item: UntypedFormControl, property: string) => {
        switch (property) {
          case 'keyType':
            return item.value.keyType?.name ?? '';
          default:
            return item.value.value;
        }
      };
      this.externalKeysDataSource.sort = this.externalKeyTableSort;
    }
  }

  @ViewChildren(MatInput)
  keyInputFields: QueryList<MatInput>;

  private unsubscribe = new Subject<void>();
  private localOutletId: string;
  private localCountryId: string;
  private isFocusEnabled: boolean;

  constructor(
    private keysService: KeysService,
    private brandService: BrandService,
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private snackBarService: SnackBarService,
    private keyTableService: KeyTableService,
    private externalKeyService: ExternalKeyService,
    private element: ElementRef,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.prepareTable();
    this.initKeys();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initKeys(): void {
    this.getExternalKeysIfAuthorized();
    this.getTableData()
      .pipe(
        tap(() => this.contentLoadingFinished()),
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of([] as GroupedKey[]);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((keys: GroupedKey[]) => {
        this.initBrandCodeTable(keys);
      });
  }

  addNewRow(): void {
    this.addRow(new GroupedKey());
  }

  addNewExternalKeyRow(): void {
    this.addExternalKeyRow(new ExternalKey());
  }

  showDeleteConfirmationDialog(row: UntypedFormGroup): void {
    if (KeyTable.isLastBrandCode(row, this.keyRows)) {
      return;
    }

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
          KeyTable.deleteRow(row);
          this.emitChange();
          this.emitValidChange();
        }
      });
  }

  showExternalKeyDeleteConfirmationDialog(row: UntypedFormGroup): void {
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
          this.externalKeysRows.removeAt(
            this.externalKeysRows
              .getRawValue()
              .findIndex(
                (arrayRow: KeyType) =>
                  JSON.stringify(arrayRow) === JSON.stringify(row.getRawValue())
              )
          );
          this.externalKeysRows.markAsDirty();
          this.emitChange();
          this.emitValidChange();
        }
      });
  }

  save(): void {
    this.submitInProgress = true;
    this.hasValidChange.emit(false);

    const allChanges: KeyChanges[] = this.changeTrackers.map(tracker => tracker.allChanges());
    const creates: FlatKey[] = allChanges.map(change => change.creates).reduce(flatten, []);
    const deletes: FlatKey[] = allChanges.map(change => change.deletes).reduce(flatten, []);

    const newExternalKeys: ExternalKey[] = this.externalKeysRows
      .getRawValue()
      .map(
        formElement =>
          new ExternalKey(
            formElement.keyType.id,
            formElement.value,
            formElement.brand ? formElement.brand.brandId : undefined,
            formElement.productGroupId ? formElement.productGroupId : undefined
          )
      );

    combineLatest([
      this.keysService.update(this.outletId, creates, deletes),
      this.externalKeyService.saveAll(this.outletId, newExternalKeys)
    ])
      .pipe(
        ignoreElements(),
        finalize(() => {
          this.submitInProgress = false;
        })
      )
      .subscribe(
        () => {},
        error => {
          this.snackBarService.showError(error);
        },
        () => {
          this.snackBarService.showInfo('EDIT_BRAND_KEYS_UPDATE_SUCCESS');
          this.keyTableService.keysSaved(true);
          this.refreshTable();
        }
      );
  }

  reset(): void {
    this.initKeys();
  }

  assignedBrandIdsExceptOf(currentKey: AbstractControl, keyType?: KeyType): string[] {
    const assignedBrandIds = KeyTable.assignedBrandIds(
      this.keyRows,
      keyType ? keyType : (currentKey.value.type as KeyType)
    );
    const assignedBrandIdsOfCurrentKey = currentKey.value.brands.map(
      (brand: Brand) => brand.brandId
    ) as string[];

    return assignedBrandIds.filter(minusFilter(assignedBrandIdsOfCurrentKey));
  }

  excludedKeyTypes(currentKey: AbstractControl): Observable<KeyType[]> {
    const excludedBrandIds = this.assignedBrandIdsExceptOf(currentKey, KeyType.BRAND_CODE);

    return this.brandService
      .getFilteredBrands(excludedBrandIds)
      .pipe(map(brands => (brands.length === 0 ? [KeyType.BRAND_CODE] : [])));
  }

  get selectedKeyTypes(): KeyType[] {
    return KeyTable.getSelectedKeyTypes(this.keyRows);
  }

  isNewRow(row: UntypedFormGroup): boolean {
    return KeyTable.isNewRow(row);
  }

  isBrandDependent(row: UntypedFormGroup): boolean {
    return KeyTable.isBrandDependent(row);
  }

  hasReadonlyBrand(row: UntypedFormGroup): boolean {
    return GroupedKey.hasReadonlyBrand(row.value);
  }

  validateBrandRequiredState(formArray: UntypedFormArray): void {
    setTimeout(() => {
      formArray.get('brand')?.markAsTouched();
      formArray.get('brand')?.updateValueAndValidity();
    });
  }

  setExternalKeyValidators(formArray: UntypedFormArray): void {
    const maxValueLength = formArray.get('keyType')?.value?.maxValueLength;
    formArray
      .get('value')
      ?.setValidators([Validators.required, Validators.maxLength(maxValueLength)]);
    formArray.get('value')?.markAsTouched();
    formArray.get('value')?.updateValueAndValidity();
  }

  private prepareTable(): void {
    this.dataSource = new MatTableDataSource<AbstractControl>([]);
    this.dataSource.filter = 'deleted';
    this.dataSource.filterPredicate = (data: AbstractControl) => data.value.deleted === false;

    this.externalKeysDataSource = new MatTableDataSource<AbstractControl>([]);

    this.initFormGroup();
    this.initExternalKeysFormGroup();

    this.keysService
      .getUpdatableKeyTypesBy(this.countryId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(keyTypes => {
        this.readonly = keyTypes.length === 0;
      });
  }

  private initFormGroup(): void {
    this.hasValidChange.emit(false);
    this.hasChange.emit(false);
    this.changeTrackers = [];
    this.keyRows = this.formBuilder.array([]);
    this.keysForm = this.formBuilder.group({ keys: this.keyRows });
    this.keysForm.reset();
    this.keyRows.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.dataSource.data = this.keyRows.controls;
    });
  }

  private initExternalKeysFormGroup(): void {
    this.hasValidChange.emit(false);
    this.hasChange.emit(false);

    this.externalKeysRows = this.formBuilder.array([]);
    this.externalKeysForm = this.formBuilder.group({ externalKeys: this.externalKeysRows });
    this.externalKeysForm.reset();
    this.externalKeysDataSource.data = [];
    this.externalKeysRows.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.externalKeysDataSource.data = this.externalKeysRows.controls;
    });
  }

  private getTableData(): Observable<GroupedKey[]> {
    this.contentLoadingStarted();
    return this.keysService.get(this.outletId, this.countryId);
  }

  private getExternalKeysTableData(): Observable<ExternalKey[]> {
    this.contentLoadingStarted();
    return this.externalKeyService.getAll(this.outletId);
  }

  private initBrandCodeTable(keys: GroupedKey[]): void {
    this.initFormGroup();
    keys.forEach(item => this.addRow(item));
    this.determineBrandCodeState();
    this.detectKeyFormChanges();
    this.preselectNewBrandCode();
  }

  private initExternalKeysTable(externalKeys: ExternalKey[]): void {
    this.initExternalKeysFormGroup();
    externalKeys.forEach(item => this.addExternalKeyRow(item));

    this.evaluateExternalKeysAuthorization();

    this.externalKeysForm.statusChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.emitChange();
      this.emitValidChange();
    });
  }

  private detectKeyFormChanges(): void {
    this.keysForm.statusChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.determineBrandCodeState();
      this.emitChange();
      this.emitValidChange();
    });
  }

  private determineBrandCodeState(): void {
    this.showBrandCodeSyncMessage = this._disabled ? false : !KeyTable.hasBrandCode(this.keyRows);
  }

  private addRow(key: GroupedKey): void {
    if (!KeyTable.emptyRowExists(this.keyRows)) {
      if (this.invalidRowsExists()) {
        this.showValidationMessages();
      } else {
        const keyTypeConfig = keyTypeConfigBy(key.type);
        const row = this.toFormGroup(
          key,
          keyTypeConfig.keyValidators,
          keyTypeConfig.brandIdsValidators
        );

        if (key.readonly || this._disabled) {
          row.disable();
        }

        this.addChangeTracker(row);

        KeyTable.controlByName(row, 'type')
          .valueChanges.pipe(takeUntil(this.unsubscribe))
          .subscribe((newType: KeyType) => {
            this.switchKeyType(row, newType);
          });

        this.keyRows.push(row);
      }
    }
  }

  private addExternalKeyRow(key: ExternalKey): void {
    const emptyRowExists =
      this.externalKeysRows.value.find(
        (externalKey: any) => externalKey.keyType.id === '' && externalKey.value === ''
      ) !== undefined;

    if (emptyRowExists && key.keyType === '' && key.value === '') {
      return;
    }

    const row = this.formBuilder.group({
      keyType: [new ExternalKeyType(key.keyType), Validators.required],
      value: [key.value, Validators.required],
      brand: [
        key.brandId ? new Brand(key.brandId) : undefined,
        KeyTable.brandRequiredForProductGroup
      ],
      productGroupId: key.productGroupId
    });

    if (key.readonly || this._disabled) {
      row.disable();
    }

    this.externalKeysRows.push(row);
  }

  private addChangeTracker(keyRow: UntypedFormGroup): void {
    const changeTracker = new KeyChangeTracker(keyRow.value as GroupedKey);
    keyRow.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((newState: GroupedKey) => {
      changeTracker.currentState = newState;
    });

    this.changeTrackers.push(changeTracker);
  }

  private toFormGroup(
    key: GroupedKey,
    keyValidators: ValidatorFn[],
    brandIdsValidators: ValidatorFn[]
  ): UntypedFormGroup {
    return this.formBuilder.group({
      type: [key.type],
      key: [key.key, keyValidators],
      brands: [key.brands, brandIdsValidators],
      deleted: [key.deleted],
      readonly: [key.readonly]
    });
  }

  private switchKeyType(keyRow: UntypedFormGroup, newType: KeyType): void {
    if (!this._disabled) {
      const keyTypeConfig = keyTypeConfigBy(newType);
      KeyTable.resetControl(keyRow, 'key', '', keyTypeConfig.keyValidators);
      KeyTable.resetControl(keyRow, 'brands', [], keyTypeConfig.brandIdsValidators);
    }
  }

  private addNewRowAndFocus(groupedKey: GroupedKey): void {
    this.addRow(groupedKey);

    const keyInputFieldsSubscription = this.keyInputFields?.changes.subscribe(
      (keyInputField: QueryList<MatInput>) => {
        this.element.nativeElement.scrollIntoView();

        // IE loses the input focus at rendering: a common community fix is to add a 1ms delay
        setTimeout(() => {
          keyInputField.last?.focus();
          keyInputFieldsSubscription.unsubscribe();
        }, 1);
      }
    );
  }

  private refreshTable(): void {
    this.initBrandCodeTable(this.keyRows.value.filter((key: GroupedKey) => !key.deleted));
  }

  private invalidRowsExists(): boolean {
    return this.keyRows.controls.some((keyRow: UntypedFormGroup) => keyRow.invalid);
  }

  private showValidationMessages(): void {
    this.keyRows.controls
      .filter((keyRow: UntypedFormGroup) => keyRow.invalid)
      .forEach((keyRow: UntypedFormGroup) => {
        ['key', 'brands'].forEach((controlName: string) =>
          KeyTable.controlByName(keyRow, controlName).markAsTouched()
        );
      });
  }

  private preselectNewBrandCode(): void {
    if (!this.keyRows.value.some((keyRow: GroupedKey) => keyRow.type === KeyType.BRAND_CODE)) {
      this.addNewRowAndFocus(new GroupedKey(KeyType.BRAND_CODE));
    }
  }

  private emitChange(): void {
    // Set timeout so that changes child components are propagated to the parent. The current status like dirty or pristine
    // is available only after one tick.
    setTimeout(() => {
      if (this.keysForm.dirty || this.externalKeysForm.dirty) {
        this.hasChange.emit(true);
      }
    });
  }

  private emitValidChange(): void {
    // Set timeout so that changes child components are propagated to the parent. The current status like dirty or pristine
    // is available only after one tick.
    setTimeout(() => {
      if (
        this.keysForm.invalid ||
        this.externalKeysForm.invalid ||
        (this.keysForm.pristine && this.externalKeysForm.pristine) ||
        this.submitInProgress
      ) {
        this.hasValidChange.emit(false);
      } else {
        this.hasValidChange.emit(true);
      }
    });
  }

  private contentLoadingStarted(): void {
    this.pageElementsLoading++;
    this.isLoading = true;
  }

  private contentLoadingFinished(): void {
    this.pageElementsLoading--;
    this.isLoading = this.pageElementsLoading > 0;
    this.isInitialized = true;
  }

  private evaluateExternalKeysAuthorization(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(['traits.externalkey.update'])
      .verify()
      .pipe(take(1))
      .subscribe(hasPermissions => {
        if (!hasPermissions) {
          this.externalKeysForm.disable();
          this.externalKeysAllowUpdate = false;
        }
      });
  }

  private getExternalKeysIfAuthorized(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(['traits.externalkey.read'])
      .verify()
      .pipe(take(1))
      .subscribe(hasPermissions => {
        if (hasPermissions) {
          this.getExternalKeysTableData()
            .pipe(
              tap(() => this.contentLoadingFinished()),
              takeUntil(this.unsubscribe)
            )
            .subscribe((externalKeys: ExternalKey[]) => {
              this.initExternalKeysTable(externalKeys);
            });
        }
      });
  }
}
