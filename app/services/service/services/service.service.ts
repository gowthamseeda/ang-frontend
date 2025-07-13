import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

import { servicesState } from '../../store';
import { Service } from '../models/service.model';
import { ServiceServiceActions } from '../store/actions';
import { serviceSelectors } from '../store/service.selectors';
import { simpleCompare } from '../../../shared/util/simple-compare';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private store: Store<servicesState.State>) {}

  fetchAll(): void {
    this.store.dispatch(ServiceServiceActions.loadServices());
  }

  fetchBy(serviceId: number): void {
    this.store.dispatch(ServiceServiceActions.loadService({ serviceId }));
  }

  getAll(): Observable<Service[]> {
    return this.store.pipe(select(serviceSelectors.selectAll));
  }

  getAllWithServiceVariantsAndOfferedServices(): Observable<Service[]> {
    return this.store.pipe(
      select(serviceSelectors.selectValidServices),
      distinctUntilChanged(simpleCompare),
      shareReplay(1)
    );
  }

  getAllOfferedServices(): Observable<Service[]> {
    return this.store.pipe(
      select(serviceSelectors.selectOfferedServices),
      distinctUntilChanged(simpleCompare),
      shareReplay(1)
    );
  }

  getPageIndex(): Observable<number> {
    return this.store.pipe(select(serviceSelectors.selectPageIndex));
  }

  setPageIndex(pageIndex: number): void {
    return this.store.dispatch(ServiceServiceActions.setPageIndex({ pageIndex }));
  }

  selectBy(serviceId: number): Observable<Service | undefined> {
    return this.store.pipe(select(serviceSelectors.selectBy(serviceId)));
  }

  selectAllBy(serviceIds: number[]): Observable<Service[] | undefined> {
    return this.store.pipe(select(serviceSelectors.selectAllBy(serviceIds)));
  }

  isLoading(): Observable<boolean> {
    return this.store.pipe(select(serviceSelectors.isLoading), distinctUntilChanged());
  }

  isServiceIsActive(serviceId: number): Observable<boolean> {
    return this.store.pipe(select(serviceSelectors.isServiceIsActive(serviceId)));
  }
}
