import { Component, Input, OnChanges, OnInit} from '@angular/core';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import { Subject, takeUntil } from 'rxjs';
import { BusinessSiteTaskService } from '../business-site-task.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { Status,Task } from '../../task.model';

@Component({
  selector: 'gp-opening-hour-task-action-button',
  templateUrl: './opening-hour-task-action-button.component.html',
  styleUrls: ['./opening-hour-task-action-button.component.scss']
})
export class OpeningHourTaskActionButtonComponent implements OnInit, OnChanges {
   @Input()
   openTasks: Task[]
   readonly forRetailFeatureToggleName = FEATURE_NAMES.FOR_RETAIL;
   
   private unsubscribe = new Subject<void>();

   isActionCompleted: boolean = false;
   
   constructor(
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isActionCompleted = false;
  }

  ngOnChanges(): void {
    this.isActionCompleted = false;
  }
  
  onAccept() {
    const dialogRef = this.matDialog.open(CommentsDialogComponent, {
      data: { task: null, isAcceptAll: true }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.submitted) {
        this.openTasks.forEach(task => {
          this.businessSiteTaskService
            .updateStatus(task.taskId, Status.APPROVED, result.comment)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe({
              next: () => {
                this.snackBarService.showInfo('TASK_APPROVED_SUCCESS');
                this.isActionCompleted = true;
              },
              error: (error) => {
                this.snackBarService.showError(error);
              }
            });
        });
      }
    });
  }
  

  onDecline() {
    const dialogRef = this.matDialog.open(CommentsDialogComponent, {
      data: { task: null, isAcceptAll: false }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.submitted) {
        this.openTasks.forEach(task => {
          this.businessSiteTaskService
            .updateStatus(task.taskId, Status.DECLINED, result.comment)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe({
              next: () => {
                this.snackBarService.showInfo('TASK_DECLINED_SUCCESS');
                this.isActionCompleted = true;
              },
              error: (error) => {
                this.snackBarService.showError(error);
              }
            });
        });
      }
    });
  }

}