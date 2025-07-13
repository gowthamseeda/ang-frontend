import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';

import { MasterBrandService } from '../../../master/brand/master-brand/master-brand.service';

import { BrandCode } from './brand-code.model';
import { BrandCodeService } from './brand-code.service';

@Component({
  selector: 'gp-brand-code',
  templateUrl: './brand-code.component.html',
  styleUrls: ['./brand-code.component.scss']
})
export class BrandCodeComponent implements OnInit, OnChanges {
  @Input()
  outletId: string;
  @Input()
  brandCodesInput?: BrandCode[];

  brandCodes: BrandCode[];
  isLoading: boolean;

  constructor(
    private brandCodeService: BrandCodeService,
    private masterBrandService: MasterBrandService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.brandCodeInputIsNullOrSomeBrandIdIsNullOrEmpty()) {
      this.isLoading = true;
      this.brandCodeService
        .get(this.outletId)
        .pipe(tap((brandCodes) => this.sortBrandCodes(brandCodes)))
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe();
    } else {
      this.sortBrandCodes(this.brandCodesInput || []);
      this.isLoading = false;
    }
  }

  sortBrandCodes(brandCodes: BrandCode[]): void {
    this.masterBrandService.sort(brandCodes, ['brandId'])
      .subscribe(sortedBrandCodes => this.brandCodes = [...sortedBrandCodes]);
  }

  private brandCodeInputIsNullOrSomeBrandIdIsNullOrEmpty(): boolean {
    return !this.brandCodesInput || this.brandCodesInput.some(brandCode => !brandCode.brandId);
  }
}
