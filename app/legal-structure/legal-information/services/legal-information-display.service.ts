import { Injectable } from '@angular/core';
import {
  DataNotification,
  DataNotificationChangedField,
  DataNotificationTaskStatus
} from '../../../notifications/models/notifications.model';
import {
  NewTaskDiff,
  Status,
  Task,
  TaskDiff,
  TaskForDisplay,
  VerificationTaskFormStatus
} from '../../../tasks/task.model';

@Injectable({
  providedIn: 'root'
})
export class LegalInformationDisplayService {
  noValueChangeMsgForBSR: string = 'NO_CHANGES_MADE_TO_THE_FIELD';
  noValueChangeMsgForMTR: string = 'EXISTING_DATA_CONFIRMED';

  generateTaskForDisplay(
    dataChangeTaskList: Task[] | undefined,
    isMTR: boolean,
    isBSR: boolean,
    aggregateField: string,
    dataNotification: DataNotification[],
    dataNotificationChangedField: DataNotificationChangedField,
    verificationTaskStatus: VerificationTaskFormStatus,
    retailVerifyData: boolean
  ): TaskForDisplay {
    let dataChangeTask: Task | undefined = this.getLatestActiveTask(dataChangeTaskList);

    if (
      !dataChangeTask &&
      dataNotification.length == 0 &&
      !(verificationTaskStatus === VerificationTaskFormStatus.PENDING && retailVerifyData)
    ) {
      return new TaskForDisplay();
    }

    let latestNotification = this.getLatestNotification(
      dataNotification,
      dataNotificationChangedField
    );

    let taskForDisplay = new TaskForDisplay();
    if (verificationTaskStatus === VerificationTaskFormStatus.PENDING && retailVerifyData){
      taskForDisplay.showVerificationNotification = true;
    } else if (dataChangeTask && dataChangeTask.status === Status.OPEN) {
      taskForDisplay.shouldDisplayFutureValue = !!dataChangeTask && (isMTR || isBSR);
      taskForDisplay.taskId = dataChangeTask.taskId;
      this.setMessageForValueChange(
        dataChangeTask,
        taskForDisplay,
        isMTR,
        isBSR,
        aggregateField
      );
      this.disableNotification(taskForDisplay);
    } else if (
      latestNotification &&
      latestNotification.taskStatus == DataNotificationTaskStatus.APPROVED
    ) {
      taskForDisplay.taskId = latestNotification.taskId!!;
      taskForDisplay.shouldDisplayFutureValue = false;
      taskForDisplay.showApprovedNotification = isBSR;
      taskForDisplay.showDeclinedNotification = false;
      taskForDisplay.showDirectChangeNotification = false;
      taskForDisplay.showVerificationNotification = false;
    } else if (
      latestNotification &&
      latestNotification.taskStatus == DataNotificationTaskStatus.DECLINED
    ) {
      taskForDisplay.taskId = latestNotification.taskId!!;
      taskForDisplay.shouldDisplayFutureValue = false;
      taskForDisplay.showApprovedNotification = false;
      taskForDisplay.showDeclinedNotification = isBSR;
      taskForDisplay.showDirectChangeNotification = false;
      taskForDisplay.showVerificationNotification = false;
    } else if (
      latestNotification &&
      latestNotification.taskStatus == DataNotificationTaskStatus.DIRECT_CHANGE
    ) {
      taskForDisplay.shouldDisplayFutureValue = false;
      taskForDisplay.showApprovedNotification = false;
      taskForDisplay.showDeclinedNotification = false;
      taskForDisplay.showDirectChangeNotification = isBSR;
      taskForDisplay.showVerificationNotification = false;
    } else {
      return new TaskForDisplay();
    }
    return taskForDisplay;
  }

  getLatestActiveTask(dataChangeTaskList: Task[] | undefined): Task | undefined {
    if (dataChangeTaskList === undefined || dataChangeTaskList.length == 0) {
      return undefined;
    }
    return dataChangeTaskList.reduce((latestActiveTask, task) =>
      latestActiveTask.taskId > task.taskId ? latestActiveTask : task
    );
  }

  getLatestNotification(
    dataNotification: DataNotification[],
    dataNotificationChangedField: DataNotificationChangedField
  ): DataNotification | undefined {
    if (dataNotification === undefined || dataNotification.length == 0) {
      return undefined;
    }
    dataNotification = dataNotification.filter(
      notification => notification.changedField === dataNotificationChangedField
    );
    if (dataNotification.length == 0) {
      return undefined;
    }
    return dataNotification.reduce((latestNotification, notification) =>
      latestNotification.date > notification.date ? latestNotification : notification
    );
  }

  private setMessageForValueChange(
    dataChangeTask: Task,
    taskForDisplay: TaskForDisplay,
    isMTR: boolean,
    isBSR: boolean,
    aggregateField: string
  ) {
    if (dataChangeTask?.aggregateField) {
      if (!!dataChangeTask?.diff) {
        let taskDiff = dataChangeTask?.diff as TaskDiff | NewTaskDiff;
        taskForDisplay.isChanged = true;
        taskForDisplay.futureValue = taskDiff?.new as string;
      } else {
        taskForDisplay.isChanged = false;
        this.setDisplayMessageForUnchangedValue(taskForDisplay, isMTR, isBSR);
      }
    } else if (dataChangeTask?.dataCluster) {
      let taskDiff = dataChangeTask?.diff as TaskDiff | NewTaskDiff;
      if (taskDiff?.new[aggregateField] !== taskDiff?.old[aggregateField]) {
        taskForDisplay.isChanged = true;
        taskForDisplay.futureValue = taskDiff?.new[aggregateField];
      } else {
        taskForDisplay.isChanged = false;
        this.setDisplayMessageForUnchangedValue(taskForDisplay, isMTR, isBSR);
      }
    }
  }

  private setDisplayMessageForUnchangedValue(
    taskForDisplay: TaskForDisplay,
    isMTR: boolean,
    isBSR: boolean
  ) {
    if (isBSR) {
      taskForDisplay.messageForUnchangedValue = this.noValueChangeMsgForBSR;
    } else if (isMTR) {
      taskForDisplay.messageForUnchangedValue = this.noValueChangeMsgForMTR;
    }
  }

  private disableNotification(taskForDisplay: TaskForDisplay) {
    taskForDisplay.showApprovedNotification = false;
    taskForDisplay.showDeclinedNotification = false;
    taskForDisplay.showDirectChangeNotification = false;
    taskForDisplay.showVerificationNotification = false;
  }
}
