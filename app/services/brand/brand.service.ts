import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../../iam/user/user.service';

import { Brand } from './brand.model';
import { BrandCollectionService } from './store/brand-collection.service';

@Injectable({ providedIn: 'root' })
export class BrandService {
  constructor(
    private brandCollectionService: BrandCollectionService,
    private store: Store<EntityCache>,
    private userService: UserService
  ) {
    this.brandCollectionService.getAll();
  }

  getAll(): Observable<Brand[]> {
    return this.store.pipe(select(this.brandCollectionService.selectors.selectEntities));
  }

  getAllIds(): Observable<string[]> {
    return this.store.pipe(select(this.brandCollectionService.selectAllIds()));
  }

  get(brandId: string): Observable<Brand> {
    return this.store.pipe(select(this.brandCollectionService.select(brandId)));
  }

  getAllForUserDataRestrictions(): Observable<Brand[]> {
    return combineLatest([this.getAll(), this.userService.getUserDataRestrictions()]).pipe(
      map(([brands, userDataRestriction]) => {
        if (!userDataRestriction.Brand || userDataRestriction.Brand.length === 0) {
          return brands;
        }

        return brands.filter(brand => userDataRestriction.Brand.includes(brand.id));
      })
    );
  }

  getFilteredBrands(
    excludedBrandIds: string[] = [],
    availableBrandIds: string[] = [],
    onlyRestricted = true
  ): Observable<Brand[]> {
    let brands = this.getAll();

    if (onlyRestricted) {
      brands = this.getAllForUserDataRestrictions();
    }

    return brands.pipe(
      map((currentBrands: Brand[]) =>
        currentBrands.filter((brand: Brand) =>
          this.brandFilter(brand, availableBrandIds, excludedBrandIds)
        )
      )
    );
  }

  private brandFilter(
    brand: Brand,
    availableBrandIds: string[],
    excludedBrandIds: string[] = []
  ): boolean {
    if (availableBrandIds && availableBrandIds.length > 0) {
      return availableBrandIds.includes(brand.id) && !excludedBrandIds.includes(brand.id);
    }
    return !excludedBrandIds.includes(brand.id);
  }
}
