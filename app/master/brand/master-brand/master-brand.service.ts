import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { ObjectPosition } from 'app/master/shared/position-control/position-control.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MasterBrand } from './master-brand.model';
import { MasterBrandCollectionService } from './store/master-brand-collection.service';
import { MasterBrandDataService } from './store/master-brand-data.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';

@Injectable({ providedIn: 'root' })
export class MasterBrandService {
  constructor(
    private brandCollectionService: MasterBrandCollectionService,
    private brandDataService: MasterBrandDataService,
    private sortingService: SortingService,
    private store: Store<EntityCache>
  ) {
    this.fetchAll();
  }

  fetchAll(): void {
    this.brandCollectionService.getAll();
  }

  fetchBy(brandId: string): Observable<MasterBrand> {
    return this.brandCollectionService.getByKey(brandId);
  }

  getAll(): Observable<MasterBrand[]> {
    return this.store
      .pipe(select(this.brandCollectionService.selectors.selectEntities))
      .pipe(map(brands => brands.sort(this.sortingService.sortByPosition)));
  }

  getBy(brandId: string): Observable<MasterBrand> {
    return this.store.pipe(select(this.brandCollectionService.select(brandId)));
  }

  create(brand: MasterBrand): Observable<MasterBrand> {
    return this.brandCollectionService.add(brand);
  }

  delete(brandId: string): Observable<string | number> {
    return this.brandCollectionService.delete(brandId);
  }

  update(brand: MasterBrand): Observable<any> {
    return this.brandCollectionService.update(brand);
  }

  updatePosition(brand: ObjectPosition): Observable<any> {
    return this.brandDataService.updatePosition(brand);
  }

  clearCacheAndFetchAll(): void {
    this.brandCollectionService.clearCache();
    this.fetchAll();
  }

  sort(groupedBrands: any[], keyArr: string[]): Observable<any[]> {
    return this.getAll()
      .pipe(map(brands => brands.map(brand => brand.id)))
      .pipe(
        map(brandIds =>
          groupedBrands.sort(
            (a, b) =>
              brandIds.indexOf(this.getNestedObject(a, keyArr)) -
              brandIds.indexOf(this.getNestedObject(b, keyArr))
          )
        )
      );
  }

  private getNestedObject(parent: any, keyArr: string[]): any {
    let tmp = parent;
    keyArr.forEach(key => (tmp = tmp[key]));
    return tmp;
  }
}
