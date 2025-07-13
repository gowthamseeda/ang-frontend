import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'gp-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input() title?: string;
  @Input() showDialogActions = false;
  @Input() hasBackdrop = true;
  @Input() backdropStyle: string;
  @Input() size: [number, number] = [750, 600];
  @Input() isOkButtonDisabled = true;
  @Input() saveButtonText?: string;
  @Output() saveButtonClicked = new EventEmitter();
  @Output() cancelButtonClicked = new EventEmitter();
  @ViewChild('popup') public popupRef: TemplateRef<any>;

  get isOpened(): boolean {
    return this.opened;
  }

  private opened = false;
  private dialogRef: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.opened = true;
    this.dialogRef = this.dialog.open(this.popupRef, {
      width: this.size[0].toString() + 'px',
      height: this.size[1].toString() + 'px',
      hasBackdrop: this.hasBackdrop,
      backdropClass: this.backdropStyle
    });

    this.dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.opened = false;
      });
  }

  close(): void {
    this.dialogRef.close();
    this.opened = false;
  }

  save(): void {
    this.isOkButtonDisabled = true;
    this.dialogRef.close();
    this.saveButtonClicked.emit();
  }

  cancel(): void {
    this.cancelButtonClicked.emit();
    this.close();
  }
}
