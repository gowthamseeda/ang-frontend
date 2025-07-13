import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-structure-node',
  templateUrl: './outlet-structure-node.component.html',
  styleUrls: ['./outlet-structure-node.component.scss']
})
export class OutletStructureNodeComponent implements OnInit {
  @Input() businessSiteId: string;
  @Input() city: string;
  @Input() inactive: boolean;
  @Input() selected: boolean;
  @Input() subOutlet: boolean;
  @Input() lastOutlet: boolean;

  constructor() {}

  ngOnInit(): void {}
}
