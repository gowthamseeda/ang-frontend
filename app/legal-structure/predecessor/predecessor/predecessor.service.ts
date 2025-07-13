import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Predecessor } from './predecessor.model';
import { PredecessorCollectionService } from './store/predecessor-collection.service';

@Injectable({
  providedIn: 'root'
})
export class PredecessorService {
  constructor(
    private predecessorCollectionService: PredecessorCollectionService,
    private store: Store<EntityCache>
  ) {}

  fetchForOutlet(outletId: string): void {
    this.predecessorCollectionService.getByKey(outletId);
  }

  getBy(outletId: string): Observable<Predecessor | undefined> {
    return this.store.pipe(select(this.predecessorCollectionService.select(outletId)));
  }

  isLoaded(): Observable<boolean> {
    return this.store.pipe(select(this.predecessorCollectionService.isLoaded()));
  }

  isChanged(outletId: string): Observable<boolean> {
    return this.store.pipe(select(this.predecessorCollectionService.isChanged(outletId)));
  }

  update(predecessor: Partial<Predecessor>): void {
    this.predecessorCollectionService.updateOneInCache(predecessor);
  }

  save(predecessor: Partial<Predecessor>): Observable<any> {
    return this.predecessorCollectionService.update(predecessor);
  }

  clearCache(): void {
    this.predecessorCollectionService.clearCache();
  }
}
