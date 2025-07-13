import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Status, TaskForDisplay } from 'app/tasks/task.model';
import { UniversalValidators } from 'ngx-validators';
import { BusinessSiteTaskService } from '../business-site-task.service';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.scss']
})
export class CommentsDialogComponent implements OnInit {
  commentForm: UntypedFormGroup;
  maxCommentCharLength = 4000;

  private commentValidators: any[] = [UniversalValidators.maxLength(this.maxCommentCharLength)];

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: TaskForDisplay, isAcceptAll?: boolean, isDeclineAll?: boolean },
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      comment: new UntypedFormControl('', this.commentValidators)
    });
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onSubmit() {
    if(this.data.isAcceptAll != undefined || this.data.isDeclineAll == true){
      this.dialogRef.close({ submitted: true, comment: this.commentForm.get('comment')?.value });
    } else if (this.data.task){
      this.businessSiteTaskService.updateStatus(
        this.data.task.taskId, Status.DECLINED, this.commentForm.get('comment')?.value
      ).subscribe({
        next: () => {
          this.snackBarService.showInfo('TASK_REJECTED_SUCCESS')
          this.closeDialog()
        },
        error: (error) => this.snackBarService.showError(error)
      })
    }
  }
}
