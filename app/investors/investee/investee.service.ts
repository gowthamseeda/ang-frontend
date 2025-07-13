import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Investee } from './investee.model';
import { InvesteeCollectionService } from './store/investee-collection.service';

@Injectable({
  providedIn: 'root'
})
export class InvesteeService {
  constructor(
    private investeeCollectionService: InvesteeCollectionService,
    private store: Store<EntityCache>
  ) {}

  fetchForOutlet(outletId: string): void {
    this.investeeCollectionService.getByKey(outletId);
  }

  getBy(outletId: string): Observable<Investee | undefined> {
    return this.store.pipe(select(this.investeeCollectionService.select(outletId)));
  }

  isLoading(): Observable<boolean> {
    return this.store.pipe(select(this.investeeCollectionService.isLoading()));
  }

  isLoaded(): Observable<boolean> {
    return this.store.pipe(select(this.investeeCollectionService.isLoaded()));
  }

  update(investee: Partial<Investee>): void {
    this.investeeCollectionService.updateOneInCache(investee);
  }

  save(investee: Investee): Observable<any> {
    return this.investeeCollectionService.update(investee);
  }

  clearCache(): void {
    this.investeeCollectionService.clearCache();
  }
}
