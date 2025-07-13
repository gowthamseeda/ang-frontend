import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObservableInput } from 'ngx-observable-input';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  finalize,
  ignoreElements,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';

import { UserDataRestrictions } from '../../../../iam/user/user.model';
import { UserService } from '../../../../iam/user/user.service';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { Brand } from '../../../../services/brand/brand.model';
import { BrandService } from '../../../../services/brand/brand.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DefaultEditActions } from '../../../../shared/components/default-edit-actions/default-edit-actions.component';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { flatten, intersectFilter } from '../../../../shared/util/arrays';
import { SubmitIndependentErrorStateMatcher } from '../../../../shared/validators/error-state-matchers/submit-independent-error-state-matcher';
import { DistributionLevelsService } from '../../../distribution-levels/distribution-levels.service';
import { AssignableType, Label } from '../../label.model';
import { LabelService } from '../../label.service';
import {
  AssignedBrandLabel,
  FlatAssignedBrandLabel,
  GroupedAssignedBrandLabel
} from '../assigned-brand-label';
import {
  AssignedBrandLabelChanges,
  AssignedBrandLabelsChangeTracker
} from '../assigned-brand-labels-change-tracker';
import { AssignedBrandLabelsService } from '../assigned-brand-labels.service';

import { AssignedBrandLabelTable } from './assigned-brand-label-table';
import { AssignedBrandLabelTableService } from './assigned-brand-label-table.service';

@Component({
  selector: 'gp-assigned-brand-label-table',
  templateUrl: './assigned-brand-label-table.component.html',
  styleUrls: ['./assigned-brand-label-table.component.scss']
})
export class AssignedBrandLabelTableComponent implements OnInit, OnDestroy, DefaultEditActions {
  @Input()
  @ObservableInput()
  outletId: Observable<string>;
  @Input()
  @ObservableInput()
  disabled: Observable<boolean>;
  @Input()
  isInTranslationEditMode: boolean;
  @Output()
  hasValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  hasChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isLoading: boolean;
  displayedColumns: string[] = ['labelId', 'brandIds', 'actions'];
  submitInProgress = false;
  currentOutletId: string;
  _disabled: boolean;
  dataSource = new MatTableDataSource<AbstractControl>([]);
  errorStateMatcher = new SubmitIndependentErrorStateMatcher();
  changeTrackers: AssignedBrandLabelsChangeTracker[] = [];
  assignedBrandLabelsForm: UntypedFormGroup;
  assignedBrandLabelRows: UntypedFormArray;
  allBrandIds: string[] = [];
  sort: any;

  private assignedDistributionLevels: string[] = [];
  private assignableLabels: Label[] = [];
  private countryId: string;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private assignedBrandLabelService: AssignedBrandLabelsService,
    private userService: UserService,
    private labelService: LabelService,
    private distributionLevelService: DistributionLevelsService,
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private snackBarService: SnackBarService,
    private brandService: BrandService,
    private outletService: OutletService,
    private assignedBrandLabelTableService: AssignedBrandLabelTableService
  ) {}

  @ViewChild(MatSort)
  set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sortingDataAccessor = (item: UntypedFormControl, property: string) =>
        item.value[property];
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.initAllBrandIds();
    this.prepareTable();

    this.getTableData()
      .pipe(
        tap(() => (this.isLoading = false)),
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of([[], true] as [GroupedAssignedBrandLabel[], boolean]);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(([assignedBrandLabels, disabled]) => {
        this._disabled = disabled;
        this.initTable(assignedBrandLabels);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
          AssignedBrandLabelTable.deleteRow(row);
        }
      });
  }

  save(): void {
    this.submitInProgress = true;

    const allChanges: AssignedBrandLabelChanges[] = this.changeTrackers.map(tracker =>
      tracker.allChanges()
    );

    const creates: FlatAssignedBrandLabel[] = allChanges
      .map(change => change.creates)
      .reduce(flatten, []);

    const deletes: FlatAssignedBrandLabel[] = allChanges
      .map(change => change.deletes)
      .reduce(flatten, []);

    this.assignedBrandLabelService
      .save(this.currentOutletId, creates, deletes)
      .pipe(
        ignoreElements(),
        finalize(() => (this.submitInProgress = false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {},
        error => this.snackBarService.showError(error),
        () => {
          this.snackBarService.showInfo('EDIT_BRAND_LABELS_UPDATE_SUCCESS');
          this.assignedBrandLabelTableService.assignedLabelsSaved(true);
          this.refreshTable();
        }
      );
  }

  reset(): void {
    this.ngOnInit();
  }

  availableBrandIds(labelId: number): string[] {
    const brandIdRestrictions = this.getBrandIdRestrictions(labelId);

    return brandIdRestrictions.length > 0
      ? this.allBrandIds.filter(intersectFilter(brandIdRestrictions))
      : this.allBrandIds;
  }

  filteredBrandIds(assignedBrandLabelRow: UntypedFormGroup): string[] {
    const currentBrandIds = assignedBrandLabelRow.value.brands.map(
      (brand: AssignedBrandLabel) => brand.brandId
    );

    return AssignedBrandLabelTable.selectedBrandIds(this.assignedBrandLabelRows).filter(
      brandId => !currentBrandIds.includes(brandId)
    );
  }

  addNewRow(): void {
    this.addRow(new GroupedAssignedBrandLabel());
  }

  isAddButtonDisabled(): boolean {
    const emptyRowExists = AssignedBrandLabelTable.emptyRowExists(this.assignedBrandLabelRows);

    return (
      this.assignedBrandLabelRows.invalid ||
      this._disabled ||
      emptyRowExists ||
      !this.brandsForRowsAvailable() ||
      !this.labelsAvailable()
    );
  }
  availableLabels(row: UntypedFormGroup): Label[] {
    let rowLabel: Label | undefined;
    const labelIdControl = row.get('labelId');

    if (labelIdControl) {
      rowLabel = this.getLabel(labelIdControl.value);
    }

    return rowLabel !== undefined
      ? this.getUnassignedLabels(this.assignableLabels).concat(rowLabel)
      : this.getUnassignedLabels(this.assignableLabels);
  }

  hasReadonlyBrand(row: UntypedFormGroup): boolean {
    return AssignedBrandLabel.hasReadonlyBrand(row.value);
  }

  private initAllBrandIds(): void {
    this.brandService
      .getAllForUserDataRestrictions()
      .pipe(
        take(1),
        map((brands: Brand[]) => (this.allBrandIds = brands.map(brand => brand.id)))
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
    this.hasValidChange.emit(false);
    this.hasChange.emit(false);
    this.changeTrackers = [];
    this.assignedBrandLabelRows = this.formBuilder.array([]);
    this.assignedBrandLabelsForm = this.formBuilder.group({
      assignedBrandLabels: this.assignedBrandLabelRows
    });
    this.assignedBrandLabelsForm.reset();

    this.assignedBrandLabelRows.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.dataSource.data = this.assignedBrandLabelRows.controls;
    });

    this.assignedBrandLabelsForm.statusChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.emitChange();
      this.emitValidChange();
    });
  }

  private getTableData(): Observable<[GroupedAssignedBrandLabel[], boolean]> {
    return this.outletId.pipe(
      tap(() => (this.isLoading = true)),
      switchMap((outletId: string) => {
        this.currentOutletId = outletId;
        this.initAssignableLabels();

        return combineLatest([
          this.getAssignedBrandLabelsFilteredByUsersBrandRestrictions(),
          this.disabled.pipe(startWith(false))
        ]);
      })
    );
  }

  private initTable(assignedBrandsLabels: GroupedAssignedBrandLabel[]): void {
    this.initFormGroup();

    // If there are no assignedBrandLabels to display, we don't trigger the "valueChanges" event of
    // assignedBrandLabelRows as no rows get added below. As this event is responsible for updating the dataSource of
    // the table, the table will display old data when switching from an outlet with assigned labes to an outlet
    // without assigned labels. Therefore we trigger the update here manually.
    if (!assignedBrandsLabels || assignedBrandsLabels.length === 0) {
      this.dataSource.data = this.assignedBrandLabelRows.controls;
    } else {
      assignedBrandsLabels.forEach(assignedBrandLabel => {
        this.addRow({
          labelId: assignedBrandLabel.labelId,
          brands: assignedBrandLabel.brands,
          deleted: assignedBrandLabel.deleted
        });
      });
    }
  }

  private getUnassignedLabels(labels: Label[]): Label[] {
    return labels
      .filter(
        (label: Label) =>
          !this.assignedBrandLabelRows.controls
            .map((control: UntypedFormGroup) => control.value as GroupedAssignedBrandLabel)
            .find(
              (assignedBrandLabel: GroupedAssignedBrandLabel) =>
                label.id === assignedBrandLabel.labelId
            )
      )
      .filter((label: Label) => this.brandsForRowAvailable(label.id));
  }

  private labelsAvailable(): boolean {
    return this.getUnassignedLabels(this.assignableLabels).length > 0;
  }

  private initAssignableLabels(): void {
    combineLatest([
      this.labelService.getAllAssignable(AssignableType.BRAND).pipe(startWith([])),
      this.distributionLevelService.get(this.currentOutletId).pipe(startWith([])),
      this.getCountryId()
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        map(([labels, distributionLevels, countryId]) => {
          this.assignableLabels = labels;
          this.assignedDistributionLevels = distributionLevels;
          this.countryId = countryId;
          this.filterAssignableLabelsByDistributionLevels();
          this.filterAssignableLabelsByCountryId();
        })
      )
      .subscribe();
  }

  private getCountryId(): Observable<string> {
    return this.outletService
      .getOrLoadBusinessSite(this.currentOutletId)
      .pipe(map(outlet => outlet.countryId));
  }

  private filterAssignableLabelsByDistributionLevels(): void {
    this.assignableLabels = this.assignableLabels.filter(
      label =>
        label.restrictedToDistributionLevels &&
        (label.restrictedToDistributionLevels.length === 0 ||
          label.restrictedToDistributionLevels.some(restrictedToDistributionLevel =>
            this.assignedDistributionLevels.includes(restrictedToDistributionLevel)
          ))
    );
  }

  private filterAssignableLabelsByCountryId(): void {
    this.assignableLabels = this.assignableLabels.filter(
      label =>
        label.restrictedToCountryIds &&
        (label.restrictedToCountryIds.length === 0 ||
          label.restrictedToCountryIds.includes(this.countryId))
    );
  }

  private getAssignedBrandLabelsFilteredByUsersBrandRestrictions(): Observable<
    GroupedAssignedBrandLabel[]
  > {
    return this.userService
      .getUserDataRestrictions()
      .pipe(
        switchMap((restrictions: UserDataRestrictions) =>
          this.assignedBrandLabelService.getAssignedBrandLabels(
            this.currentOutletId,
            restrictions.Brand || []
          )
        )
      );
  }

  private getBrandIdRestrictions(labelId: number): string[] {
    const rowLabel: Label | undefined = this.assignableLabels.find(
      (label: Label) => label.id === labelId
    );

    return rowLabel && rowLabel.restrictedToBrandIds && rowLabel.restrictedToBrandIds.length > 0
      ? rowLabel.restrictedToBrandIds
      : [];
  }

  private addRow(assignedBrandsLabel: GroupedAssignedBrandLabel): void {
    if (!AssignedBrandLabelTable.emptyRowExists(this.assignedBrandLabelRows)) {
      if (this.invalidRowsExists()) {
        this.showValidationMessages();
      } else {
        const row = this.formBuilder.group({
          labelId: [assignedBrandsLabel.labelId, [Validators.required]],
          brands: [assignedBrandsLabel.brands, [Validators.required]],
          deleted: [assignedBrandsLabel.deleted]
        });

        if (this._disabled) {
          row.disable();
        }

        this.addChangeTracker(row);
        this.assignedBrandLabelRows.push(row);
      }
    }
  }

  private addChangeTracker(assignedBrandLabelRow: UntypedFormGroup): void {
    const changeTracker = new AssignedBrandLabelsChangeTracker(
      assignedBrandLabelRow.value as GroupedAssignedBrandLabel
    );

    assignedBrandLabelRow.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((newState: GroupedAssignedBrandLabel) => {
        changeTracker.currentState = newState;
      });

    this.changeTrackers.push(changeTracker);
  }

  private refreshTable(): void {
    this.initTable(
      this.assignedBrandLabelRows.value.filter(
        (assignedBrandLabel: GroupedAssignedBrandLabel) => !assignedBrandLabel.deleted
      )
    );
  }

  private getLabel(labelId: number): Label | undefined {
    return this.assignableLabels.find((label: Label) => label.id === labelId);
  }

  private brandsForRowAvailable(labelId: number): boolean {
    return this.availableBrandIds(labelId).some(
      (brandId: string) =>
        !AssignedBrandLabelTable.selectedBrandIds(this.assignedBrandLabelRows).includes(brandId)
    );
  }

  private brandsForRowsAvailable(): boolean {
    return this.assignableLabels
      .filter((label: Label) =>
        this.assignedBrandLabelRows.controls.every(
          (row: UntypedFormGroup) => row.value.labelId !== label.id
        )
      )
      .some((label: Label) =>
        this.availableBrandIds(label.id).some((brandId: string) => {
          return !AssignedBrandLabelTable.selectedBrandIds(this.assignedBrandLabelRows).includes(
            brandId
          );
        })
      );
  }

  private invalidRowsExists(): boolean {
    return this.assignedBrandLabelRows.controls.some((labelRow: UntypedFormGroup) => labelRow.invalid);
  }

  private showValidationMessages(): void {
    this.assignedBrandLabelRows.controls
      .filter((labelRow: UntypedFormGroup) => labelRow.invalid)
      .forEach((labelRow: UntypedFormGroup) => {
        ['labelId', 'brands'].forEach((controlName: string) =>
          AssignedBrandLabelTable.controlByName(labelRow, controlName).markAsTouched()
        );
      });
  }

  private emitChange(): void {
    // Set timeout so that changes child components are propagated to the parent. The current status like dirty or pristine
    // is available only after one tick.
    setTimeout(() => {
      if (this.assignedBrandLabelsForm.dirty) {
        this.hasChange.emit(true);
      }
    });
  }

  private emitValidChange(): void {
    // Set timeout so that changes child components are propagated to the parent. The current status like dirty or pristine
    // is available only after one tick.
    setTimeout(() => {
      if (
        this.assignedBrandLabelsForm.invalid ||
        this.assignedBrandLabelsForm.pristine ||
        this.submitInProgress
      ) {
        this.hasValidChange.emit(false);
      } else {
        this.hasValidChange.emit(true);
      }
    });
  }
}
