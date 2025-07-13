import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MasterProductGroup } from './master-product-group.model';
import { MasterProductGroupCollectionService } from './store/master-product-group-collection.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';

@Injectable({ providedIn: 'root' })
export class MasterProductGroupService {
  constructor(
    private productGroupCollectionService: MasterProductGroupCollectionService,
    private sortingService: SortingService,
    private store: Store<EntityCache>
  ) {
    this.fetchAll();
  }

  fetchAll(): void {
    this.productGroupCollectionService.getAll();
  }

  fetchBy(productGroupId: string): Observable<MasterProductGroup> {
    return this.productGroupCollectionService.getByKey(productGroupId);
  }

  getAll(): Observable<MasterProductGroup[]> {
    return this.store
      .pipe(select(this.productGroupCollectionService.selectors.selectEntities))
      .pipe(map(productGroups => productGroups.sort(this.sortingService.sortByName)));
  }

  getBy(productGroupId: string): Observable<MasterProductGroup> {
    return this.store.pipe(select(this.productGroupCollectionService.select(productGroupId)));
  }

  create(productGroup: MasterProductGroup): Observable<MasterProductGroup> {
    return this.productGroupCollectionService.add(productGroup);
  }

  delete(productGroupId: string): Observable<string | number> {
    return this.productGroupCollectionService.delete(productGroupId);
  }

  update(productGroup: MasterProductGroup): Observable<any> {
    return this.productGroupCollectionService.update(productGroup);
  }

  clearCacheAndFetchAll(): void {
    this.productGroupCollectionService.clearCache();
    this.fetchAll();
  }
}
