import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-snapshot-predecessors',
  templateUrl: './snapshot-predecessors.component.html',
  styleUrls: ['./snapshot-predecessors.component.scss']
})
export class SnapshotPredecessorsComponent implements OnInit {
  @Input()
  predecessors: string[];

  @Input()
  isChanged: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
