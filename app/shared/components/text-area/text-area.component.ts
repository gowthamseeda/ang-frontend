import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TaskForDisplay, VerificationTaskFormStatus } from '../../../tasks/task.model';
import {
  CommentsDialogComponent
} from "../../../tasks/shared/comments-dialog/comments-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'gp-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextAreaComponent implements OnInit, OnChanges {
  @ViewChild('textInput') textInput!: ElementRef;
  @Input() form: UntypedFormGroup;
  @Input() controlName = 'textArea';
  @Input() placeHolder: string;
  @Input() maxCharLength: number;
  @Input() minHeight = 100;
  @Input() isMaxCharLengthLimited = true;
  @Input() readonly = true;
  @Input() required = false;
  @Input() verificationTaskStatus = VerificationTaskFormStatus.NOT_PRESENT;
  @Input() revertReadonly = false;
  @Input() isBSR = false;
  @Input() isMTR: boolean;
  @Input() taskForDisplay: TaskForDisplay = new TaskForDisplay();
  @Input() isVerificationTaskPresent = false;
  @Output() changed = new EventEmitter<KeyboardEvent>();
  @Input() isForRetailEnabled: boolean = false;
  fieldInitialValue: string | null = null;
  VerificationTaskFormStatus = VerificationTaskFormStatus;

  constructor(
    private matDialog: MatDialog
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDisabled();
    if (changes.form) {
      this.fieldInitialValue = changes.form.currentValue.get(this.controlName)?.value;
    }
  }

  ngOnInit(): void {
    this.updateDisabled();
  }

  onKeyUp(value: KeyboardEvent): void {
    this.changed.emit(value);
    const currentValue = this.form.get(this.controlName)?.value;
    const taskPresent = this.verificationTaskStatus !== VerificationTaskFormStatus.NOT_PRESENT;
    if (taskPresent && this.isBSR && this.isForRetailEnabled) {
      this.verificationTaskStatus = (this.fieldInitialValue !== currentValue)
        ? VerificationTaskFormStatus.CHANGED
        : VerificationTaskFormStatus.REMAIN;
    }
  }
  onKeyDown(value: KeyboardEvent): void {
    const dataChangedTaskPresent = this.taskForDisplay.shouldDisplayFutureValue;
    if (dataChangedTaskPresent && this.isMTR && this.isForRetailEnabled) {
      value.preventDefault();
      this.textInput.nativeElement.blur();
      this.matDialog.open(CommentsDialogComponent, {
        data: { task:this.taskForDisplay }
      })
    }
  }

  private updateDisabled(): void {
    if (this.readonly) {
      this.form.controls[this.controlName].disable();
    } else {
      this.form.controls[this.controlName].enable();
    }
  }

  getClassObject() {
    if (this.verificationTaskStatus !== VerificationTaskFormStatus.NOT_PRESENT && this.isBSR && this.isForRetailEnabled) {
      return {
        'data-changed-notification': (this.taskForDisplay.showDirectChangeNotification ||
          this.verificationTaskStatus === VerificationTaskFormStatus.REMAIN),
        'verification-task-present': this.verificationTaskStatus === VerificationTaskFormStatus.PENDING,
        'changes-made': this.verificationTaskStatus === VerificationTaskFormStatus.CHANGED
      };
    } else {
      return {
        'data-changed-notification': this.taskForDisplay.showDirectChangeNotification,
        'verification-task-present': this.verificationTaskStatus === VerificationTaskFormStatus.PENDING
      };
    }
  }
}
