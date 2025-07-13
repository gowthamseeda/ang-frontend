import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-id-block',
  templateUrl: './outlet-id-block.component.html',
  styleUrls: ['./outlet-id-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletIdBlockComponent implements OnInit {
  @Input()
  outletId: string;

  constructor() {}

  ngOnInit(): void {}
}
