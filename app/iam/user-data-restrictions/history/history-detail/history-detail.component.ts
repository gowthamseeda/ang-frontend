import { Component, Input, OnInit } from '@angular/core';

import { AssignedDataRestriction } from '../history.component';

@Component({
  selector: 'gp-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  @Input() assignedDataRestrictions: AssignedDataRestriction | null;

  constructor() {}

  ngOnInit(): void {}
}
