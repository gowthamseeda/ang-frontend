import { Component, Input, OnInit } from '@angular/core';

import { MismatchAddress } from './mismatch-address.model';

@Component({
  selector: 'gp-map-message',
  templateUrl: './map-message.component.html',
  styleUrls: ['./map-message.component.scss']
})
export class MapMessageComponent implements OnInit {
  @Input() mismatchAddress: MismatchAddress;

  constructor() {}

  ngOnInit(): void {}
}
