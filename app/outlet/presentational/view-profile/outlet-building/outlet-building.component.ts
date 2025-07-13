import { Component, Input, OnInit } from '@angular/core';

enum BuildingType {
  BASIC = 'BASIC'
}

@Component({
  selector: 'gp-outlet-building',
  templateUrl: './outlet-building.component.html',
  styleUrls: ['./outlet-building.component.scss']
})
export class OutletBuildingComponent implements OnInit {
  @Input()
  productGroups: string[];
  @Input()
  outletType: string;
  @Input()
  outletName: string;

  constructor() {}

  ngOnInit(): void {}

  isBasicBuildingType(): boolean {
    return this.outletType === BuildingType.BASIC;
  }
}
