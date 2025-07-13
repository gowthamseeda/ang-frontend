import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

const default_number_of_garages = 5;

@Component({
  selector: 'gp-basic-building',
  templateUrl: './basic-building.component.html',
  styleUrls: ['./basic-building.component.scss']
})
export class BasicBuildingComponent implements OnInit, OnChanges {
  @Input()
  productGroupIds: string[];
  @Input()
  outletName: string;

  doorIndex = -1;

  constructor() {
    this.productGroupIds = [];
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isNoProductGroups()) {
      this.productGroupIds = Array(default_number_of_garages);
    }
    this.doorIndex = this.calculateDoorIndex();
  }

  isDoorIndex(index: number): boolean {
    return index === this.doorIndex;
  }

  calculateDoorIndex(): number {
    if (this.productGroupIds.length === 1) {
      return 0;
    }
    if (this.productGroupIds.length % 2 === 0) {
      return this.productGroupIds.length / 2 - 1;
    }
    if (this.productGroupIds.length % 2 !== 0) {
      return Math.floor(this.productGroupIds.length / 2) - 1;
    }
    return -1;
  }

  calculateBlocksAfterTheDoor(): number[] {
    return Array(this.productGroupIds.length - (this.doorIndex + 1));
  }

  private isNoProductGroups(): boolean {
    return this.productGroupIds.length === 0;
  }
}
