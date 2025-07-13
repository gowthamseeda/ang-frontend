import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BusinessSiteSelectDialogComponent } from './business-site-select-dialog/business-site-select-dialog.component';
import { SelectDialogComponent } from './select-dialog/select-dialog.component';

@Component({
  selector: 'gp-data-restriction-assigner',
  templateUrl: './data-restriction-assigner.component.html',
  styleUrls: ['./data-restriction-assigner.component.scss']
})
export class DataRestrictionAssignerComponent implements OnDestroy {
  @Input()
  dataRestrictionId: string;
  @Input()
  assignedDataRestrictionValues: string[];
  @Output()
  assignedDataRestrictionValuesChange = new EventEmitter<string[]>();

  private unsubscribe = new Subject<void>();

  constructor(public dialogMat: MatDialog) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  remove(dataRestrictionValue: string): void {
    this.assignedDataRestrictionValues = this.assignedDataRestrictionValues.filter(
      currentValue => currentValue !== dataRestrictionValue
    );
    this.assignedDataRestrictionValuesChange.emit(this.assignedDataRestrictionValues);
  }

  openDialog(): void {
    this.dataRestrictionId === 'BusinessSite'
      ? this.openSelectDialog(BusinessSiteSelectDialogComponent)
      : this.openSelectDialog(SelectDialogComponent);
  }

  private openSelectDialog(componentOrTemplateRef: ComponentType<any>): void {
    const dialog = this.dialogMat.open(componentOrTemplateRef, {
      width: '320px',
      height: '250px',
      data: {
        dataRestrictionId: this.dataRestrictionId,
        assignedDataRestrictionValues: this.assignedDataRestrictionValues
      }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((dataRestrictionValues: string[]) => {
        if (dataRestrictionValues) {
          this.assignedDataRestrictionValues = this.assignedDataRestrictionValues.concat(
            dataRestrictionValues
          );
          this.assignedDataRestrictionValuesChange.emit(this.assignedDataRestrictionValues);
        }
      });
  }
}
