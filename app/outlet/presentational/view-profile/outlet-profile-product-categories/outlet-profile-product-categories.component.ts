import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-profile-product-categories',
  templateUrl: './outlet-profile-product-categories.component.html',
  styleUrls: ['./outlet-profile-product-categories.component.scss']
})
export class OutletProfileProductCategoriesComponent implements OnInit {
  @Input()
  productCategories: string[];

  constructor() {}

  ngOnInit(): void {}
}
