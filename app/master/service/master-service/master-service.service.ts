import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { ObjectPosition } from 'app/master/shared/position-control/position-control.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterService } from './master-service.model';
import { MasterServiceCollectionService } from './store/master-service-collection.service';
import { MasterServiceDataService } from './store/master-service-data.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';

@Injectable({ providedIn: 'root' })
export class MasterServiceService {
  constructor(
    private serviceCollectionService: MasterServiceCollectionService,
    private serviceDataService: MasterServiceDataService,
    private sortingService: SortingService,
    private store: Store<EntityCache>
  ) {
    this.fetchAll();
  }

  fetchAll(): void {
    this.serviceCollectionService.getAll();
  }

  fetchBy(serviceId: string): Observable<MasterService> {
    return this.serviceCollectionService.getByKey(serviceId);
  }

  getAll(): Observable<MasterService[]> {
    return this.store
      .pipe(select(this.serviceCollectionService.selectors.selectEntities))
      .pipe(map(services => services.sort(this.sortingService.sortByPosition)));
  }

  getBy(serviceId: number): Observable<MasterService> {
    return this.store.pipe(select(this.serviceCollectionService.select(serviceId)));
  }

  create(service: MasterService): Observable<MasterService> {
    return this.serviceCollectionService.add(service);
  }

  delete(serviceId: number): Observable<string | number> {
    return this.serviceCollectionService.delete(serviceId);
  }

  update(service: MasterService): Observable<any> {
    return this.serviceCollectionService.update(service);
  }

  updatePosition(service: ObjectPosition): Observable<any> {
    return this.serviceDataService.updatePosition(service);
  }

  clearCacheAndFetchAll(): void {
    this.serviceCollectionService.clearCache();
    this.fetchAll();
  }
}
