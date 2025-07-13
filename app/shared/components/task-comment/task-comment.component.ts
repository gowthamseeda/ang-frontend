import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Comment } from '../../../tasks/task.model';

@Component({
  selector: 'gp-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {
  columnsToDisplay: string[] = ['editor', 'date', 'comment']
  dataToDisplay: Comment
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Comment[]
  ) {
  }

  ngOnInit(): void {
    this.dataToDisplay = this.getLatestComments()
  }

  private getLatestComments(): Comment {
    return this.data.reduce((latest, current) => {
      return new Date(current.creationDate) > new Date(latest.creationDate) ? current : latest;
    });
  }
}
