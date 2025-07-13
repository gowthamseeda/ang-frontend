import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog.module';

@Component({
  selector: 'gp-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  confirmDialog: ConfirmDialog;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  ngOnInit(): void {
    this.confirmDialog = new ConfirmDialog({
      text: {
        title: this.data.title,
        content: this.data.content,
        confirmButton: this.data.confirmButton
      },
      options: { hideCancelButton: this.data.hideCancelButton }
    });
  }
}
