import { Component, Input, OnInit } from '@angular/core';

import { SchedulerJob, SchedulerType } from '../../model/scheduler.model';

@Component({
  selector: 'gp-job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.scss']
})
export class JobStatusComponent implements OnInit {
  @Input()
  type: SchedulerType;
  @Input()
  job: SchedulerJob;

  schedulerType = SchedulerType;

  constructor() {}

  ngOnInit(): void {}
}
