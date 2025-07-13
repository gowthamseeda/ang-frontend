import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PredecessorItem } from '../../predecessor/predecessor.model';
import { PredecessorDialogComponent } from '../predecessor-dialog/predecessor-dialog.component';

@Component({
  selector: 'gp-predecessors-table',
  templateUrl: './predecessors-table.component.html',
  styleUrls: ['./predecessors-table.component.scss']
})
export class PredecessorsTableComponent implements OnInit, OnDestroy {
  @Input() isDisable: boolean;
  @Input() predecessorItems: Observable<ReadonlyArray<PredecessorItem>>;
  @Input() isSuccessor: boolean;
  @Input() isLoaded: Observable<boolean>;
  @Output() removePredecessorItem = new EventEmitter<string>();
  @Output() addPredecessorItem = new EventEmitter<Partial<PredecessorItem>>();

  columnsToDisplay: Observable<string[]>;

  private unsubscribe = new Subject<void>();

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.columnsToDisplay = of(['legalName', 'address', 'brandCode', 'action']);
  }

  openSearchDialog(): void {
    this.dialog
      .open<PredecessorDialogComponent, undefined, PredecessorItem>(PredecessorDialogComponent, {
        height: '80vh'
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(predecessor => {
        if (predecessor) {
          this.addPredecessorItem.emit({ ...predecessor });
        }
      });
  }

  openRemoveConfirmationDialog(outletId: string): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '550px',
        data: {
          title: 'DELETE_ENTRY',
          content: 'DELETE_ENTRY_QUESTION',
          confirmButton: 'YES'
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(confirmed => {
        if (confirmed) {
          this.removePredecessorItem.emit(outletId);
        }
      });
  }
}
