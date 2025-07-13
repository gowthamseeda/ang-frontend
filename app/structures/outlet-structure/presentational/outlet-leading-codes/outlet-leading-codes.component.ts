import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { Brand } from '../../../../services/brand/brand.model';
import { sortByReference } from '../../../../shared/util/arrays';
import { BrandCode, BusinessName } from '../../model/outlet-structure.model';

@Component({
  selector: 'gp-outlet-leading-code',
  templateUrl: './outlet-leading-codes.component.html',
  styleUrls: ['./outlet-leading-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletLeadingCodeComponent implements OnInit, OnChanges {
  @Input()
  businessNames: BusinessName[];
  @Input()
  brandCodes: BrandCode[];
  @Input()
  allBrands: Brand[] = [];

  allBrandIds: string[] = [];
  sortedBrandIds: string[];
  leadingBusinessName?: BusinessName;
  leadingBrandCode?: BrandCode;

  sortedBusinessNames?: BusinessName[];
  sortedBrandCodes?: BrandCode[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.allBrandIds = this.allBrands.map(brand => brand.id);
    this.sortedBrandIds = this.getSortedBrandIds(this.brandCodes);
    this.sortedBusinessNames = this.getSortedBusinessNames(this.businessNames);
    this.sortedBrandCodes = this.getSortedBrandCodes(this.brandCodes);

    if (this.sortedBusinessNames) {
      this.leadingBusinessName = this.sortedBusinessNames[0];
    }

    if (this.sortedBrandCodes) {
      this.leadingBrandCode = this.sortedBrandCodes[0];
    }
  }

  hasMoreThanOneBusinessName(): boolean | undefined {
    return this.sortedBusinessNames && this.sortedBusinessNames.length > 1;
  }

  private getSortedBrandIds(brandCodes: BrandCode[]): string[] {
    let brandCodeIds: string[] = brandCodes
      ? brandCodes.map((brandCode: BrandCode) => brandCode.brandId)
      : [];

    brandCodeIds = brandCodeIds.filter((item, pos) => brandCodeIds.indexOf(item) === pos);
    return sortByReference<string, string>(brandCodeIds, this.allBrandIds, (elem: string) => elem);
  }

  private getSortedBusinessNames(businessNames: BusinessName[]): BusinessName[] {
    if (businessNames && businessNames.length > 0) {
      return sortByReference<BusinessName, string>(
        businessNames,
        this.allBrandIds,
        (elem: BusinessName) => elem.brandId
      );
    }

    return [];
  }

  private getSortedBrandCodes(brandCodes: BrandCode[]): BrandCode[] {
    if (brandCodes && brandCodes.length > 0) {
      return sortByReference<BrandCode, string>(
        brandCodes,
        this.allBrandIds,
        (elem: BrandCode) => elem.brandId
      );
    }

    return [];
  }
}
