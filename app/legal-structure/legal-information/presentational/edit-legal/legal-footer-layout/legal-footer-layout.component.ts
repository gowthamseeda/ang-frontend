import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from 'app/shared/model/constants';
import { take } from "rxjs/operators";
import {
  DataNotification,
  DataNotificationChangedField
} from '../../../../../notifications/models/notifications.model';
import { TaskCommentComponent } from "../../../../../shared/components/task-comment/task-comment.component";
import {
  AggregateDataField,
  DataCluster,
  Task,
  TaskForDisplay, Type,
  VerificationTaskFormStatus
} from '../../../../../tasks/task.model';
import { TaskDataService } from "../../../../../tasks/task/store/task-data.service";
import { EditLegalComponentViewState } from '../../../container/edit-legal/edit-legal-component-view-state';
import { LegalInformationDisplayService } from '../../../services/legal-information-display.service';

@Component({
  selector: 'gp-legal-footer-layout',
  templateUrl: './legal-footer-layout.component.html',
  styleUrls: ['./legal-footer-layout.component.scss']
})
export class LegalFooterLayoutComponent implements OnInit, OnChanges {
  @Input()
  title: string;
  @Input()
  readonly: Boolean = true;
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
  viewState: EditLegalComponentViewState;
  @Input()
  companyDataReadOnly: boolean;
  @Input()
  verificationTasksStatusMap: { [key: string]: VerificationTaskFormStatus } = {};
  @Input()
  isForRetailEnabled: boolean;
  @Input()
  dataNotification: DataNotification[] = [];
  @Input()
  activeTasks: Task[];
  @Input()
  taskNumber: number | undefined;
  @Output()
  remain = new EventEmitter<string>();
  @Input()
  isRO: boolean = false;
  @Input()
  isOutletRetailer: boolean = false;

  taskForDisplay: TaskForDisplay = new TaskForDisplay();
  dataChangeTaskList: Task[] | undefined;
  VerificationTaskFormStatus = VerificationTaskFormStatus;

  fieldData: AggregateDataField = {
    aggregateField: AGGREGATE_FIELDS.LEGAL_INFO_LEGAL_FOOTER,
    aggregateName: AGGREGATE_NAMES.COMPANY_LEGAL_INFO,
    dataCluster: DataCluster.LEGAL_LEGAL_FOOTER.toString()
  };

  constructor(
    private taskDataService: TaskDataService,
    private matDialog: MatDialog,
    private legalInformationDisplayService: LegalInformationDisplayService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.readonly) {
      this.readonly = changes.readonly.currentValue;
    }

    if (changes.verificationTaskStatus) {
      this.verificationTaskStatus = changes.verificationTaskStatus.currentValue;
    }

    if (changes.retailVerifyData) {
      this.retailVerifyData = changes.retailVerifyData.currentValue;
    }

    if (changes.isUserAuthorizedForVerificationTask) {
      this.isUserAuthorizedForVerificationTask = changes.isUserAuthorizedForVerificationTask.currentValue;
    }

    if (changes.isMTR) {
      this.isMTR = changes.isMTR.currentValue;
    }

    if (changes.isBSR) {
      this.isBSR = changes.isBSR.currentValue;
    }

    if (changes.viewState) {
      this.viewState = changes.viewState.currentValue;
    }

    if (changes.companyDataReadOnly) {
      this.companyDataReadOnly = changes.companyDataReadOnly.currentValue;
    }

    if (changes.verificationTasksStatusMap) {
      this.verificationTasksStatusMap = changes.verificationTasksStatusMap.currentValue;
    }

    if (changes.isForRetailEnabled) {
      this.isForRetailEnabled = changes.isForRetailEnabled.currentValue;
    }

    if (changes.dataNotification) {
      this.dataNotification = changes.dataNotification.currentValue;
    }

    if (changes.activeTasks) {
      this.dataChangeTaskList = this.activeTasks.filter(
        activeTask =>
          Type.DATA_CHANGE?.toString() === activeTask.type.toString() &&
          (DataCluster.LEGAL_LEGAL_FOOTER.toString() === activeTask.dataCluster?.toString() ||
            AGGREGATE_FIELDS.LEGAL_INFO_LEGAL_FOOTER.toString() ===
            activeTask.aggregateField?.toString())
      );
    }

    this.taskForDisplay = this.legalInformationDisplayService.generateTaskForDisplay(
      this.dataChangeTaskList,
      this.isMTR,
      this.isBSR,
      AGGREGATE_FIELDS.LEGAL_INFO_LEGAL_FOOTER,
      this.dataNotification,
      DataNotificationChangedField.LEGAL_FOOTER,
      this.verificationTasksStatusMap['LEGAL_FOOTER'],
      this.retailVerifyData
    );
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

  legalInfoOnChanged() {
    if (this.verificationTasksStatusMap['LEGAL_FOOTER'] !== VerificationTaskFormStatus.NOT_PRESENT && this.isBSR
      && this.isForRetailEnabled) {
      this.verificationTasksStatusMap['LEGAL_FOOTER'] = VerificationTaskFormStatus.CHANGED;
    }

    this.taskForDisplay.showDirectChangeNotification = false
    this.taskForDisplay.showApprovedNotification = false
    this.taskForDisplay.showDeclinedNotification = false
  }
}
