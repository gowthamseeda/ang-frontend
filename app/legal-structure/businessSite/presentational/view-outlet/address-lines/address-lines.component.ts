import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { SelectedAddress } from './selected-address.model';

@Component({
  selector: 'gp-address-lines',
  templateUrl: './address-lines.component.html',
  styleUrls: ['./address-lines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressLinesComponent implements OnInit {
  @Input()
  address: SelectedAddress;

  constructor() {}

  ngOnInit(): void {}
}
