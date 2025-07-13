import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-job-id-read-only',
  templateUrl: './job-id-read-only.component.html',
  styleUrls: ['./job-id-read-only.component.scss']
})
export class JobIdReadOnlyComponent implements OnInit {
  @Input()
  jobId: string;

  constructor() {}

  ngOnInit(): void {}
}
