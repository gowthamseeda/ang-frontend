import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {ProductGroup} from "../../../services/product-group/product-group.model";
import {ProductGroupService} from "../../../services/product-group/product-group.service";

@Component({
  selector: 'gp-translated-product-group-flag',
  templateUrl: './translated-product-group-flag.component.html',
  styleUrls: ['./translated-product-group-flag.component.scss']
})
export class TranslatedProductGroupFlagComponent implements OnInit, OnDestroy {
  @Input()
  productGroupFlag: string;

  allProductGroups: ProductGroup[] = [];

  private unsubscribe = new Subject<void>();

  constructor( private productGroupService: ProductGroupService) {}

  ngOnInit(): void {
    this.productGroupService.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((productGroups: ProductGroup[]) => {
        this.allProductGroups = productGroups;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  productGroupBy(productGroupFlag: string): ProductGroup | undefined {
    return this.allProductGroups.find(productGroup => 'productGroups_'.concat(productGroup.id) === productGroupFlag);
  }
}
