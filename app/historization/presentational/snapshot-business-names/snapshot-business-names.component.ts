import { Component, Input, OnInit } from '@angular/core';
import { BusinessName } from '../../models/outlet-history-snapshot.model';

@Component({
  selector: 'gp-snapshot-business-names',
  templateUrl: './snapshot-business-names.component.html',
  styleUrls: ['./snapshot-business-names.component.scss']
})
export class SnapshotBusinessNamesComponent implements OnInit {
  @Input()
  businessNames: BusinessName[];

  @Input()
  isChanged: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
