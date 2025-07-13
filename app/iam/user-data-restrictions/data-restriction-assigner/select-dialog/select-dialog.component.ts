import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataRestrictionService } from '../../../data-restriction/data-restriction.service';

@Component({
  selector: 'gp-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent implements OnInit, OnDestroy {
  availableDataRestrictionValues: string[];
  control: UntypedFormControl = new UntypedFormControl();

  private unsubscribe = new Subject<void>();

  constructor(
    private dataRestrictionService: DataRestrictionService,
    public dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dataRestrictionService
      .get(this.data.dataRestrictionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        dataRestriction => {
          this.availableDataRestrictionValues = dataRestriction.items
            .filter(currentValue => !this.data.assignedDataRestrictionValues.includes(currentValue))
            .sort();
        },
        () => {
          this.availableDataRestrictionValues = [];
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
