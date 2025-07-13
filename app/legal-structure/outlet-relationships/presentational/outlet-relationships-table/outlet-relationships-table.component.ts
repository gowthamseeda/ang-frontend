import {
  Component,
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
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { OutletRelationship } from '../../models/outlet-relationships.model';
import { OutletRelationshipsService } from '../../services/outlet-relationships.service';
import { OutletSelectionComponent } from '../outlet-selection/outlet-selection.component';

@Component({
  selector: 'gp-outlet-relationships-table',
  templateUrl: './outlet-relationships-table.component.html',
  styleUrls: ['./outlet-relationships-table.component.scss']
})
export class OutletRelationshipsTableComponent implements OnInit, OnDestroy {
  @Input()
  get outletId(): string {
    return this.localOutletId;
  }

  set outletId(outletId: string) {
    this.localOutletId = outletId;
    if (outletId) {
      this.initForm();
    }
  }

  @Input()
  isEditable = true;

  @Output()
  updateForm = new EventEmitter();

  form: UntypedFormGroup;
  formArr: UntypedFormArray;

  displayedColumns: string[] = ['relatedBusinessSiteId', 'relationshipDefCode', 'actions'];
  dataSource = new MatTableDataSource<AbstractControl>();

  isLoading: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private localOutletId: string;
  private nonce = 0;
  private unsubscribe = new Subject<void>();

  constructor(
    private outletRelationshipsService: OutletRelationshipsService,
    private matDialog: MatDialog,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: AbstractControl, property: string) => {
      switch (property) {
        case 'relatedBusinessSiteId':
          return data.get('relatedBusinessSiteId')?.value;
        case 'relationshipDefCode':
          return data.get('relationshipDefCode')?.value;
        default:
          return data[property];
      }
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initForm(): void {
    this.formArr = this.formBuilder.array([]);
    this.form = this.formBuilder.group({ outletRelationships: this.formArr });

    this.formArr.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.emitUpdateForm();
    });

    this.outletRelationshipsService
      .get(this.outletId)
      .pipe(
        tap((outletRelationships: OutletRelationship[]) => {
          outletRelationships.forEach(outletRelationship => {
            this.pushToFormArray(
              this.nonce++,
              outletRelationship.relatedBusinessSiteId,
              outletRelationship.relationshipDefCode
            );
          });
          this.isLoading = false;
        }),
        catchError(error => {
          this.emitUpdateForm();
          this.isLoading = false;
          return of(error);
        })
      )
      .subscribe();
  }

  emitUpdateForm(): void {
    this.dataSource.data = this.formArr.controls;
    setTimeout(() => {
      this.updateForm.emit();
    });
  }

  addOutletRelationship(): void {
    this.pushToFormArray(this.nonce++);
    this.formArr.markAsDirty();
  }

  removeOutletRelationship(nonce: number): void {
    this.formArr.removeAt(
      this.formArr.value.findIndex((element: { nonce: number }) => element.nonce === nonce)
    );
    this.formArr.markAsDirty();
  }

  pushToFormArray(
    nonce: number,
    relatedBusinessSiteId: string = '',
    relationshipDefCode: string = ''
  ): void {
    this.formArr.push(
      this.formBuilder.group({
        relatedBusinessSiteId: [relatedBusinessSiteId, Validators.required],
        relationshipDefCode: [
          { value: relationshipDefCode, disabled: !this.isEditable },
          Validators.required
        ],
        nonce: nonce
      })
    );
  }

  openOutletsDialog(control: AbstractControl): void {
    const dialog = this.matDialog.open(OutletSelectionComponent, {
      width: '650px',
      height: '650px',
      data: {
        excludedOutletIds: [this.outletId]
      }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((outletId: string) => {
        if (outletId) {
          control.get('relatedBusinessSiteId')?.setValue(outletId);
          control.markAsDirty();
        }
      });
  }
}
