import { Pipe, PipeTransform } from '@angular/core';

import { Brand } from '../../../../services/brand/brand.model';
import { BrandCode, BusinessName } from '../../model/outlet-structure.model';

@Pipe({
  name: 'outletLeadingCodes'
})
export class OutletLeadingCodesPipe implements PipeTransform {
  transform(arr: BrandCode[] | BusinessName[] = [], key: string, allBrands: Brand[] = []): string {
    let list = '';
    arr.forEach((val: BrandCode | BusinessName) => {
      list += `•   ${val[key]} (${this.getBrandName(val.brandId, allBrands)})\n`;
    });
    return list;
  }

  private getBrandName(brandId: string, allBrands: Brand[]): string {
    if (brandId && allBrands) {
      const foundBrand = allBrands.find(brand => brand.id === brandId);
      if (foundBrand) {
        return foundBrand.name;
      }
    }
    return brandId;
  }
}
