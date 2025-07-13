import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-id-and-status',
  templateUrl: './outlet-id-and-status.component.html',
  styleUrls: ['./outlet-id-and-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletIdAndStatusComponent implements OnInit {
  @Input()
  outletId: string;
  @Input()
  active: Boolean;

  constructor() {}

  ngOnInit(): void {}
}
