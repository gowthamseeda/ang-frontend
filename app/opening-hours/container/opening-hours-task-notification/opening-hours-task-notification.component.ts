import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import { OpeningHourNotification } from "../../../notifications/models/notifications.model";
import { TaskDataService } from "../../../tasks/task/store/task-data.service";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { OpeningHourTasksCommentComponent } from "../opening-hours-tasks-comment/opening-hour-tasks-comment-component";

@Component({
  selector: 'gp-opening-hours-task-notification',
  templateUrl: './opening-hours-task-notification.component.html',
  styleUrls: ['./opening-hours-task-notification.component.scss']
})
export class OpeningHoursTaskNotificationComponent implements OnInit, OnChanges {
  @Input()
  openingHoursDataNotification: OpeningHourNotification[] = []
  @Input()
  displayOpeningHoursDataNotification: OpeningHourNotification[] = []
  @Input()
  dataChangeTaskAvailable?: boolean = false
  @Output()
  showNotification =  new EventEmitter<string>();
  @Output()
  removeNotification = new EventEmitter<string>();
  @Output()
  showDataChangeTask =  new EventEmitter<string>();
  @Output()
  removeDataChangeTask = new EventEmitter<string>();

  readonly SHOW = "SHOW";
  readonly HIDE = "HIDE";
  readonly APPROVED = "APPROVED";
  readonly DIRECT_CHANGE = "DIRECT_CHANGE";
  readonly DECLINED = "DECLINED";

  showApprovedNotification: boolean = false
  showDeclineNotification: boolean = false
  showDirectChangeNotification: boolean = false
  declineTask: number[] = []
  approvedActionText = this.HIDE
  declinedActionText = this.HIDE
  directChangeActionText = this.HIDE
  dataChangeActionText = this.SHOW

  constructor(
    private taskDataService: TaskDataService,
    private matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.initNotification()
  }

  ngOnChanges() {
    this.initNotification()
  }

  private initNotification() {
    if(this.openingHoursDataNotification != undefined){
      this.showApprovedNotification = this.checkNotificationExist(this.APPROVED)
      this.showDirectChangeNotification = this.checkNotificationExist(this.DIRECT_CHANGE)
      this.showDeclineNotification = this.checkNotificationExist(this.DECLINED)
      this.declineTask = this.openingHoursDataNotification
        .filter((item) => item.taskStatus === this.DECLINED)
        .map((item) => item.taskId)
        .filter((taskId): taskId is number => taskId !== undefined)
    }
  }

  private checkNotificationExist(
    notification: string
  ): boolean {
    return this.openingHoursDataNotification.some(
      (item) => item.taskStatus === notification
    );
  }

  taskCommentPopUp(): void {
    if(this.declineTask.length == 0)
      return

    const requests = this.declineTask.map((taskId) =>
      this.taskDataService
        .getById(taskId)
        .pipe(take(1))
    )

    forkJoin(requests)
      .subscribe((task) => {
        this.matDialog.open(OpeningHourTasksCommentComponent, {
          data: task
        });
      });
  }

  onApprovedClick(): void {
    if (this.approvedActionText == this.SHOW) {
      this.approvedActionText = this.HIDE
      this.showNotification.emit(this.APPROVED)
    } else if (this.approvedActionText == this.HIDE) {
      this.approvedActionText = this.SHOW
      this.removeNotification.emit(this.APPROVED)
    }
  }

  onDeclinedClick(): void {
    if (this.declinedActionText == this.SHOW) {
      this.declinedActionText = this.HIDE
      this.showNotification.emit(this.DECLINED)
    } else if (this.declinedActionText == this.HIDE) {
      this.declinedActionText = this.SHOW
      this.removeNotification.emit(this.DECLINED)
    }
  }

  onDirectChangedClick(): void {
    if (this.directChangeActionText == this.SHOW) {
      this.directChangeActionText = this.HIDE
      this.showNotification.emit(this.DIRECT_CHANGE)
    } else if (this.directChangeActionText == this.HIDE) {
      this.directChangeActionText = this.SHOW
      this.removeNotification.emit(this.DIRECT_CHANGE)
    }
  }

  onDataChangeTaskClick(): void {
    if (this.dataChangeActionText == this.SHOW) {
      this.dataChangeActionText = this.HIDE
      this.showDataChangeTask.emit()
    } else if (this.dataChangeActionText == this.HIDE) {
      this.dataChangeActionText = this.SHOW
      this.removeDataChangeTask.emit()
    }
  }

  resetButton(): void {
    this.approvedActionText = this.SHOW
    this.declinedActionText = this.SHOW
    this.directChangeActionText = this.SHOW
  }
}
