import { Component, Input, OnInit } from '@angular/core';
import {of} from "rxjs";

@Component({
  selector: 'gp-additional-content',
  templateUrl: './additional-content.component.html',
  styleUrls: ['./additional-content.component.scss']
})
export class AdditionalContentComponent implements OnInit {
  @Input()
  headline: string;
  @Input()
  isRetailOutlet: boolean = false;
  @Input()
  isForRetailEnabled: boolean = false;
  @Input()
  isMarketResponsible: boolean = false;
  @Input()
  isBusinessSiteResponsible: boolean = false;
  @Input()
  outletId?: string;
  expanded = false;
  isBlockVerificationsTasksRemained = of(false);
  additionalAddressAggregateFields = [
    'additionalAddressAddressAddition',
    'additionalAddressCity',
    'additionalAddressDistrict',
    'additionalAddressStreet',
    'additionalAddressStreetNumber',
    'additionalAddressZipCode'
  ]

  constructor() {}

  ngOnInit(): void {}

  toggleAdditionalContent(): void {
    this.expanded = !this.expanded;
  }
}
