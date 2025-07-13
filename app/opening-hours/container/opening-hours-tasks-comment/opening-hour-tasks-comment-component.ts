import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Task, TaskComment} from '../../../tasks/task.model'

@Component({
  selector: 'gp-opening-hours-task-comment',
  templateUrl: './opening-hour-tasks-comment-component.html',
  styleUrls: ['./opening-hour-tasks-comment-component.scss']
})
export class OpeningHourTasksCommentComponent implements OnInit {
  columnsToDisplay: string[] = ['taskId', 'editor', 'date', 'comment']
  dataToDisplay: TaskComment[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task[]
  ) {
  }

  ngOnInit(): void {
    this.initTaskComment()
  }

  initTaskComment(): void {
    this.data.forEach(task => {
        let comment = task.comments?.reduce((latest, current) => {
          return new Date(current.creationDate) > new Date(latest.creationDate) ? current : latest;
        })

        if(comment !== undefined) {
          let taskComment: TaskComment = {
            taskId: task.taskId.toString(),
            creationDate: comment.creationDate,
            user: comment.user,
            comment: comment.comment
          }

          this.dataToDisplay.push(taskComment)
        }
      }
    )
  }
}
