import { Component, Input, OnInit } from '@angular/core';

import { ProductCategoryWithServices } from './product-category-with-services.model';

@Component({
  selector: 'gp-outlet-profile-product-category-and-services',
  templateUrl: './outlet-profile-product-category-and-services.component.html',
  styleUrls: ['./outlet-profile-product-category-and-services.component.scss']
})
export class OutletProfileProductCategoryAndServicesComponent implements OnInit {
  @Input()
  productCategoryWithServices: ProductCategoryWithServices;

  constructor() {}

  ngOnInit(): void {}
}
