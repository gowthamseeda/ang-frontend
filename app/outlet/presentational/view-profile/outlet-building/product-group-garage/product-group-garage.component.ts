import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-product-group-garage',
  templateUrl: './product-group-garage.component.html',
  styleUrls: ['./product-group-garage.component.scss']
})
export class ProductGroupGarageComponent implements OnInit {
  @Input()
  productGroupId: string;

  constructor() {}

  ngOnInit(): void {}

  getImageSrc(): string {
    return this.productGroupId
      ? `assets/icons/${this.productGroupId.toLowerCase()}-active-grounded.svg`
      : '';
  }
}
