import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MasterServiceVariant, MasterServiceVariantUpdate } from './master-service-variant.model';
import { MasterServiceVariantCollectionService } from './store/master-service-variant-collection.service';
import { MasterServiceVariantDataService } from './store/master-service-variant-data.service';

@Injectable({ providedIn: 'root' })
export class MasterServiceVariantService {
  constructor(
    private serviceVariantDataService: MasterServiceVariantDataService,
    private serviceVariantCollectionService: MasterServiceVariantCollectionService,
    private store: Store<EntityCache>
  ) {
    this.fetchAll();
  }

  fetchAll(): void {
    this.serviceVariantCollectionService.getAll();
  }

  getAll(): Observable<MasterServiceVariant[]> {
    return this.store.pipe(select(this.serviceVariantCollectionService.selectors.selectEntities));
  }

  getBy(serviceVariantId: number): Observable<MasterServiceVariant> {
    return this.store.pipe(select(this.serviceVariantCollectionService.select(serviceVariantId)));
  }

  isLoading(): Observable<boolean> {
    return this.store.pipe(select(this.serviceVariantCollectionService.isLoading()));
  }

  createOrUpdate(serviceVariants: MasterServiceVariantUpdate[]): Observable<any> {
    return this.serviceVariantDataService.multiCreateOrUpdate(serviceVariants);
  }

  delete(serviceVariants: MasterServiceVariant[]): Observable<any> {
    return this.serviceVariantDataService.multiDelete(serviceVariants);
  }

  clearCacheAndFetchAll(): void {
    this.serviceVariantCollectionService.clearCache();
    this.fetchAll();
  }
}
