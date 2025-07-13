import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { UniversalValidators } from 'ngx-validators';

import {
  TaskConfirmDialog,
  TaskConfirmDialogCloseData,
  TaskConfirmDialogData
} from './task-confirm-dialog.model';

@Component({
  selector: 'gp-task-confirm-dialog',
  templateUrl: './task-confirm-dialog.component.html',
  styleUrls: ['./task-confirm-dialog.component.scss']
})
export class TaskConfirmDialogComponent implements OnInit {
  taskConfirmDialog: TaskConfirmDialog;
  taskForm: UntypedFormGroup;
  maxCommentCharLength = 4000;
  required = false;

  private commentValidators: any[] = [UniversalValidators.maxLength(this.maxCommentCharLength)];

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TaskConfirmDialogComponent, TaskConfirmDialogCloseData>,
    @Inject(MAT_DIALOG_DATA) public data: TaskConfirmDialogData
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      dueDate: new UntypedFormControl(''),
      comment: new UntypedFormControl('', this.commentValidators)
    });
    this.taskConfirmDialog = new TaskConfirmDialog({
      text: {
        title: this.data.title,
        confirmButton: this.data.confirmButton
      },
      options: {
        hideDueDate: this.data.hideDueDate,
        multipleVerificationTasks: this.data.multipleVerificationTasks
      }
    });

    if (this.data?.mandatoryComment) {
      this.required = true;
      this.taskForm
        .get('comment')
        ?.setValidators(this.commentValidators.concat(Validators.required));
    }
  }

  close(data: TaskConfirmDialogCloseData): void {
    if (data?.payload?.dueDate) {
      this.dialogRef.close({
        ...data,
        payload: {
          ...data.payload,
          dueDate: moment(data?.payload?.dueDate).format('YYYY-MM-DD')
        }
      });
    } else {
      this.dialogRef.close(data);
    }
  }
}
