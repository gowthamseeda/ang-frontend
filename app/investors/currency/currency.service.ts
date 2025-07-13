import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CurrencyCollectionService } from './store/currency-collection.service';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  constructor(
    private currencyCollectionService: CurrencyCollectionService,
    private store: Store<EntityCache>
  ) {
    this.currencyCollectionService.getAll();
  }

  getAllIds(): Observable<string[]> {
    return this.store.pipe(select(this.currencyCollectionService.selectAllIds()));
  }

  isLoaded(): Observable<boolean> {
    return this.store.pipe(select(this.currencyCollectionService.isLoaded()));
  }
}
