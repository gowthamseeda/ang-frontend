import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

import { BrandProductGroup } from '../brand-product-group/brand-product-group.model';

import { ServiceVariant } from './service-variant.model';
import { ServiceVariantServiceActions } from './store/actions';
import { serviceVariantSelectors } from './store/service-variant.selectors';
import { simpleCompare } from '../../shared/util/simple-compare';
import { servicesState } from '../store';

@Injectable({
  providedIn: 'root'
})
export class ServiceVariantService {
  constructor(private store: Store<servicesState.State>) {}

  fetchAllBy(outletId: string): void {
    this.store.dispatch(
      ServiceVariantServiceActions.loadServiceVariants({
        outletId
      })
    );
  }

  getAll(): Observable<ServiceVariant[]> {
    return this.store.pipe(
      select(serviceVariantSelectors.selectAll),
      distinctUntilChanged(simpleCompare),
      shareReplay(1)
    );
  }

  getBy(
    serviceId: number,
    brandId: string,
    productGroupId: string
  ): Observable<ServiceVariant | undefined> {
    return this.store.pipe(
      select(serviceVariantSelectors.selectBy(serviceId, brandId, productGroupId))
    );
  }

  extractUniqueBrandProductGroups(): Observable<BrandProductGroup[]> {
    return this.store.pipe(
      select(serviceVariantSelectors.extractUniqueBrandProductGroups),
      distinctUntilChanged(simpleCompare),
      shareReplay(1)
    );
  }

  isLoading(): Observable<boolean> {
    return this.store.pipe(select(serviceVariantSelectors.isLoading), distinctUntilChanged());
  }

  isEmpty(): Observable<boolean> {
    return this.store.pipe(select(serviceVariantSelectors.isEmpty));
  }
}
