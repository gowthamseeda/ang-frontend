import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TaskFooterEvent, Type } from '../../task.model';

import { TaskConfirmDialogComponent } from './task-confirm-dialog/task-confirm-dialog.component';
import {
  TaskConfirmDialogCloseData,
  TaskConfirmDialogData
} from './task-confirm-dialog/task-confirm-dialog.model';

@Component({
  selector: 'gp-task-footer',
  templateUrl: './task-footer.component.html',
  styleUrls: ['./task-footer.component.scss']
})
export class TaskFooterComponent {
  confirmButtonTranslationKey = 'OK';
  discardButtonTranslationKey = 'CANCEL';
  confirmDiscardAction = false;
  hideDueDate = false;

  confirmDialogTitle = '';
  discardDialogTitle = '';

  @Input() taskId?: number;
  @Input() confirmButtonDisabled = false;
  @Input() discardButtonDisabled = false;
  @Input() useOnlyContent = false;
  @Input() multipleVerificationTasks = false;
  @Output() confirm = new EventEmitter<TaskFooterEvent>();
  @Output() discard = new EventEmitter<TaskFooterEvent>();

  constructor(private dialog: MatDialog) {}

  @Input() set type(type: Type) {
    switch (type) {
      case Type.DATA_CHANGE:
        this.confirmButtonTranslationKey = 'TASK_REQUEST_APPROVAL';
        this.confirmDialogTitle = 'TASK_REQUEST_APPROVAL';
        break;
      case Type.DATA_VERIFICATION:
        this.confirmButtonTranslationKey = 'TASK_ACCEPT';
        this.discardButtonTranslationKey = 'TASK_DENY';
        this.confirmDialogTitle = 'TASK_APPROVE_TITLE';
        this.discardDialogTitle = 'TASK_REJECT_TITLE';
        this.confirmDiscardAction = true;
        this.hideDueDate = true;
        break;
      default:
    }
  }

  confirmApprove(): void {
    this.verify(
      {
        title: this.confirmDialogTitle,
        confirmButton: 'OK',
        multipleVerificationTasks: this.multipleVerificationTasks
      },
      this.confirm
    );
  }

  confirmDiscard(): void {
    if (this.confirmDiscardAction) {
      this.verify(
        {
          title: this.discardDialogTitle,
          confirmButton: 'OK',
          mandatoryComment: true
        },
        this.discard
      );
    } else {
      this.discard.emit();
    }
  }

  private verify(data: TaskConfirmDialogData, eventEmitter: EventEmitter<TaskFooterEvent>): void {
    this.dialog
      .open<TaskConfirmDialogComponent, TaskConfirmDialogData, TaskConfirmDialogCloseData>(
        TaskConfirmDialogComponent,
        {
          data: {
            ...data,
            hideDueDate: this.hideDueDate
          }
        }
      )
      .afterClosed()
      .subscribe(result => {
        if (result?.confirm) {
          this.disableConfirmButtonAndDiscardButton();
          eventEmitter.emit({ taskId: this.taskId, payload: result.payload });
        }
      });
  }

  private disableConfirmButtonAndDiscardButton(): void {
    this.confirmButtonDisabled = true;
    this.discardButtonDisabled = true;
  }
}
