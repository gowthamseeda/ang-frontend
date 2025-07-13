import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-profile-product-category-and-services-loader',
  templateUrl: './outlet-profile-product-category-and-services-loader.component.html',
  styleUrls: ['./outlet-profile-product-category-and-services-loader.component.scss']
})
export class OutletProfileProductCategoryAndServicesLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
