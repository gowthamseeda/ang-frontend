import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'gp-brand-pylone',
  templateUrl: './brand-pylone.component.html',
  styleUrls: ['./brand-pylone.component.scss']
})
export class BrandPyloneComponent implements OnInit, OnChanges {
  @Input()
  brandIds: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.brandIds) {
      this.fillOrSliceBrandIds();
    }
  }

  fillOrSliceBrandIds(): void {
    if (this.brandIds.length > 5) {
      this.brandIds = this.brandIds.slice(0, 5);
    }
    if (this.brandIds.length < 3) {
      const lengthBefore = this.brandIds.length;
      const filler: string[] = Array(3 - lengthBefore);
      this.brandIds.push(...filler);
    }
  }
}
