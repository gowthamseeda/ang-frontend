import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { FeatureToggleService } from 'app/shared/directives/feature-toggle/feature-toggle.service';
import {
  AggregateDataField,
  DataCluster,
  Task,
  TaskForDisplay,
  Type,
  VerificationTaskFormStatus
} from 'app/tasks/task.model';
import { take } from "rxjs/operators";
import {
  DataNotification,
  DataNotificationChangedField
} from '../../../../../notifications/models/notifications.model';
import { TaskCommentComponent } from "../../../../../shared/components/task-comment/task-comment.component";
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import {
  CommentsDialogComponent
} from "../../../../../tasks/shared/comments-dialog/comments-dialog.component";
import { TaskDataService } from "../../../../../tasks/task/store/task-data.service";
import { LegalInformationDisplayService } from '../../../services/legal-information-display.service';

export const VAT_NUMBER_CONTROL_NAME = 'vatNumber';

@Component({
  selector: 'gp-vat-number-input',
  templateUrl: './vat-number-input.component.html',
  styleUrls: ['./vat-number-input.component.scss']
})
export class VatNumberInputComponent implements OnChanges, OnInit {
  @ViewChild('textInput') textInput!: ElementRef;
  @Input()
  formGroup: UntypedFormGroup;
  @Input()
  readonly = true;
  @Input()
  verificationTaskStatus = VerificationTaskFormStatus.NOT_PRESENT;
  @Input()
  retailVerifyData = false;
  @Input()
  isUserAuthorizedForVerificationTask = false;
  @Input()
  isMTR: boolean;
  @Input()
  isBSR: boolean;
  @Input()
  activeTasks: Task[];
  @Input()
  dataNotification: DataNotification[] = [];
  @Input()
  taskNumber: number | undefined;
  @Input()
  isRO: boolean = false;
  @Input()
  isOutletRetailer: boolean = false;

  @Output()
  changed = new EventEmitter<string>();
  @Output()
  remain = new EventEmitter<string>();

  required = false;
  controlName = VAT_NUMBER_CONTROL_NAME;
  shouldDisplayFutureValue = false;
  futureValue: string;
  isChanged = false;

  dataChangeTaskList: Task[] | undefined;
  taskForDisplay: TaskForDisplay = new TaskForDisplay();
  fieldInitialValue: string = '';
  VerificationTaskFormStatus = VerificationTaskFormStatus;

  fieldData: AggregateDataField = {
    aggregateField: AGGREGATE_FIELDS.LEGAL_INFO_VAT_NUMBER,
    aggregateName: AGGREGATE_NAMES.COMPANY_LEGAL_INFO,
    dataCluster: DataCluster.LEGAL_VAT_NO.toString()
  };

  isForRetailEnabled: boolean;

  constructor(
    private legalInformationDisplayService: LegalInformationDisplayService,
    private featureToggleService: FeatureToggleService,
    private taskDataService: TaskDataService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.featureToggleService.isFeatureEnabled('FOR_RETAIL').subscribe(forRetailEnabled => {
      this.isForRetailEnabled = forRetailEnabled;
      this.fieldInitialValue = this.formGroup.get(this.controlName)?.value;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.readonly) {
      this.readonly = changes.readonly.currentValue;

      const ctrl = this.formGroup.get(this.controlName);
      if (this.readonly) {
        ctrl?.disable();
      } else {
        ctrl?.enable();
      }
    }

    if (changes.isBSR) {
      this.isBSR = changes.isBSR.currentValue;
    }

    if (changes.isMTR) {
      this.isMTR = changes.isMTR.currentValue;
    }

    if (changes.formGroup) {
      this.fieldInitialValue = changes.formGroup.currentValue.get(this.controlName)?.value;
    }

    if (changes.dataNotification) {
      this.dataNotification = changes.dataNotification.currentValue;
    }

    if (changes.verificationTaskStatus) {
      this.verificationTaskStatus = changes.verificationTaskStatus.currentValue;
    }

    if (changes.retailVerifyData) {
      this.retailVerifyData = changes.retailVerifyData.currentValue;
    }

    if (changes.activeTasks) {
      this.dataChangeTaskList = changes.activeTasks.currentValue.filter(
        activeTask =>
          Type.DATA_CHANGE?.toString() === activeTask.type.toString() &&
          (DataCluster.LEGAL_VAT_NO.toString() === activeTask.dataCluster?.toString() ||
            AGGREGATE_FIELDS.LEGAL_INFO_VAT_NUMBER.toString() ===
            activeTask.aggregateField?.toString())
      );
    }

    this.taskForDisplay = this.legalInformationDisplayService.generateTaskForDisplay(
      this.dataChangeTaskList,
      this.isMTR,
      this.isBSR,
      AGGREGATE_FIELDS.LEGAL_INFO_VAT_NUMBER,
      this.dataNotification,
      DataNotificationChangedField.VAT_NO,
      this.verificationTaskStatus,
      this.retailVerifyData
    );
  }

  onKeyUp(value: string): void {
    this.changed.emit(value);
    const currentValue = this.formGroup.get(this.controlName)?.value;
    const verificationTaskPresent = this.verificationTaskStatus !== VerificationTaskFormStatus.NOT_PRESENT;
    const dataChangedTaskPresent = this.taskForDisplay.shouldDisplayFutureValue;
    if (verificationTaskPresent && this.isBSR && this.isForRetailEnabled) {
      this.verificationTaskStatus = (this.fieldInitialValue !== currentValue)
        ? VerificationTaskFormStatus.CHANGED
        : VerificationTaskFormStatus.REMAIN;
    } else if (dataChangedTaskPresent && this.isMTR && this.isForRetailEnabled) {
      this.formGroup.controls[this.controlName].setValue(this.fieldInitialValue);
      this.textInput.nativeElement.blur();
      this.matDialog.open(CommentsDialogComponent, {
        data: { task: this.taskForDisplay }
      })
    }

    this.taskForDisplay.showDirectChangeNotification = false
    this.taskForDisplay.showApprovedNotification = false
    this.taskForDisplay.showDeclinedNotification = false
  }

  onRemainClick(identifier: string): void {
    this.remain.emit(identifier);
  }

  taskCommentPopup(): void {
    this.taskDataService.getById(<number>this.taskNumber)
      .pipe(take(1))
      .subscribe(task => {
        this.matDialog.open(TaskCommentComponent, {
          data: task.comments
        });
      }
      );
  }
}
