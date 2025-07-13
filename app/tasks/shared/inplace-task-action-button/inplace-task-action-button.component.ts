import { Component, Input, OnDestroy } from '@angular/core';
import {ChangeTaskStatusesResource, Status, TaskForDisplay, Type, DataCluster} from 'app/tasks/task.model';
import { BusinessSiteTaskService } from '../business-site-task.service';
import {Observable, Subject, takeUntil} from 'rxjs';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import {filter, map, take} from "rxjs/operators";
import {TaskWebSocketService} from "../../service/task-websocket.service";
import { Task } from '../../../tasks/task.model';

@Component({
  selector: 'gp-inplace-task-action-button',
  templateUrl: './inplace-task-action-button.component.html',
  styleUrls: ['./inplace-task-action-button.component.scss']
})
export class InplaceTaskActionButtonComponent implements OnDestroy {
  @Input()
  task: TaskForDisplay
  @Input()
  fieldsStartName: string;
  @Input()
  specificFields: string[] = [];
  @Input()
  outletId: string;
  @Input()
  dataCluster : string;
  isOpenTaskAvailable: Observable<boolean>;
  filteredTasks: Task[];

  private unsubscribe = new Subject<void>()

  constructor(
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private taskWebSocketService: TaskWebSocketService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    if(!this.task)  {
      this.evaluateTask()
      this.subscribeToTask()
    }
  }

  onAccept() {
    if (this.fieldsStartName || this.specificFields.length > 0) {
      this.bulkChangeTaskStatus(Status.APPROVED)
    } else {
      this.businessSiteTaskService.updateStatus(this.task.taskId, Status.APPROVED).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: () =>
          this.snackBarService.showInfo('TASK_APPROVED_SUCCESS'),
        error: (error) => this.snackBarService.showError(error)
      })
    }
  }

  onDecline() {
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      data: { task:this.task, isDeclineAll: !this.task }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result?.submitted && !this.task) {
        this.bulkChangeTaskStatus(Status.DECLINED, result.comment)
      }
    });
  }

  bulkChangeTaskStatus(status: Status, comment?: string) {
    let tasks = this.filteredTasks.map(task => {
      return {taskId: task.taskId, taskStatus: status, comment: comment} as ChangeTaskStatusesResource
    })
    this.businessSiteTaskService.updateTasks(tasks).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: () =>
        this.snackBarService.showInfo('TASK_APPROVED_SUCCESS'),
      error: (error) => this.snackBarService.showError(error)
    })
  }

  subscribeToTask() {
    this.taskWebSocketService
      .getLiveTask()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(
          data =>
            data.businessSiteId === this.outletId &&
            data.aggregateField !== undefined &&
            data.type === Type.DATA_CHANGE &&
            (data.aggregateField.startsWith(this.fieldsStartName) || this.specificFields.includes(data.aggregateField))
        )
      )
      .subscribe(_data => {
        this.evaluateTask();
      });
  }

  evaluateTask(){
    this.isOpenTaskAvailable = this.businessSiteTaskService.getBy(this.outletId).pipe(
      take(1),
      map(tasks => {
        let filteredTasks = tasks.filter(task =>
          task.type === Type.DATA_CHANGE && task.status === Status.OPEN &&
          (
            (task.dataCluster === DataCluster.COMMUNICATION_CHANNELS) ||
            (
              task.aggregateField != undefined &&
              (task.aggregateField.startsWith(this.fieldsStartName) || this.specificFields.includes(task.aggregateField))
            )
          )
        );
        this.filteredTasks = filteredTasks;
        return filteredTasks.length > 0;
      })
    );
  }
}
