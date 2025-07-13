import {Component, Input} from '@angular/core';
import {ChangeTaskStatusesResource, Status, Task} from 'app/tasks/task.model';
import {BusinessSiteTaskService} from '../../business-site-task.service';
import { Subject, takeUntil} from 'rxjs';
import {SnackBarService} from 'app/shared/services/snack-bar/snack-bar.service';
import {FEATURE_NAMES} from '../../../../shared/model/constants';
import {CommentsDialogComponent} from "../../comments-dialog/comments-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'gp-review-changes-made-notification',
  templateUrl: './review-changes-made-notification.component.html',
  styleUrls: ['./review-changes-made-notification.component.scss']
})
export class ReviewChangesMadeNotificationComponent {
  @Input()
  openTasks: Task[]
  readonly forRetailFeatureToggleName = FEATURE_NAMES.FOR_RETAIL;

  private unsubscribe = new Subject<void>();

  constructor(
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService,
    public matDialog: MatDialog
  ) { }

  onAcceptAll() {
    const dialogRef = this.matDialog.open(CommentsDialogComponent, {
      data: {task: null, isAcceptAll: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.submitted) {
        let tasks = this.openTasks.map(task => {
          return {taskId: task.taskId, taskStatus: Status.APPROVED, comment: result.comment} as ChangeTaskStatusesResource
        })
        this.businessSiteTaskService.updateTasks(tasks).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: () =>
            this.snackBarService.showInfo('TASK_APPROVED_SUCCESS'),
          error: (error) => this.snackBarService.showError(error)
        })
      }
    });
  }
  onDeclineAll() {
    const dialogRef = this.matDialog.open(CommentsDialogComponent, {
      data: { task:null, isAcceptAll:false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.submitted) {
        let tasks = this.openTasks.map(task => {
          return {taskId: task.taskId, taskStatus: Status.DECLINED, comment: result.comment} as ChangeTaskStatusesResource
        })
        this.businessSiteTaskService.updateTasks(tasks).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: () =>
            this.snackBarService.showInfo('TASK_APPROVED_SUCCESS'),
          error: (error) => this.snackBarService.showError(error)
        })
      }
    });
  }
}
