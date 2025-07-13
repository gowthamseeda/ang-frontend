import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-structure-node-chips',
  templateUrl: './outlet-structure-node-chips.component.html',
  styleUrls: ['./outlet-structure-node-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletStructureNodeChipsComponent implements OnInit {
  @Input()
  tags: string[];
  @Input()
  inactive = false;

  constructor() {}

  ngOnInit(): void {}
}
