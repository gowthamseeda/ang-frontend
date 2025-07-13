import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Brand } from '../../../services/brand/brand.model';
import { BrandService } from '../../../services/brand/brand.service';

@Component({
  selector: 'gp-translated-brand-flag',
  templateUrl: './translated-brand-flag.component.html',
  styleUrls: ['./translated-brand-flag.component.scss']
})
export class TranslatedBrandFlagComponent implements OnInit, OnDestroy {
  @Input()
  brandFlag: string;

  allBrands: Brand[] = [];

  private unsubscribe = new Subject<void>();

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.brandService.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((brands: Brand[]) => {
        this.allBrands = brands;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  brandBy(brandFlag: string): Brand | undefined {
    return this.allBrands.find(brand => 'brands_'.concat(brand.id) === brandFlag);
  }
}
