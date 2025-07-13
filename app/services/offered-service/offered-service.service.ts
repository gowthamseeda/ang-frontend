import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, shareReplay, take } from 'rxjs/operators';

import { BrandProductGroup } from '../brand-product-group/brand-product-group.model';
import { servicesState } from '../store';
import { MultiOfferedService, OfferedServiceValidity, ValidityChange } from '../validity/validity.model';

import { OfferedServiceServiceActions } from './store/actions';
import { offeredServiceValidationSelectors } from './store/selectors/offered-service-validation.selectors';
import { offeredServiceSelectors } from './store/selectors/offered-service.selectors';
import { OfferedService } from './offered-service.model';
import { simpleCompare } from '../../shared/util/simple-compare';
import { SisterOutlet } from '../shared/models/sister-outlet.model';

@Injectable({ providedIn: 'root' })
export class OfferedServiceService {
  constructor(private store: Store<servicesState.State>) {}

  fetchAllForOutlet(outletId: string): void {
    this.store.dispatch(OfferedServiceServiceActions.loadOfferedServices({ outletId }));
  }

  getAll(): Observable<OfferedService[]> {
    return this.store.pipe(select(offeredServiceSelectors.selectAll));
  }

  resetAll(): void {
    return this.store.dispatch(OfferedServiceServiceActions.resetOfferedServices());
  }

  getId(
    serviceId: number,
    brandId: string,
    productGroupId: string
  ): Observable<string | undefined> {
    return this.store.pipe(
      select(offeredServiceSelectors.selectMatchingId(serviceId, brandId, productGroupId))
    );
  }

  get(offeredServiceId: string): Observable<OfferedService | undefined> {
    return this.store.pipe(select(offeredServiceSelectors.selectById(offeredServiceId)));
  }

  getAllForServiceWith(serviceId: number): Observable<OfferedService[]> {
    return this.store.pipe(select(offeredServiceSelectors.selectAllForServiceWith(serviceId)));
  }

  add(offeredService: OfferedService): void {
    this.store.dispatch(OfferedServiceServiceActions.addOfferedService({ offeredService }));
  }

  remove(id: string): void {
    this.store.dispatch(OfferedServiceServiceActions.removeOfferedService({ id }));
  }

  toggleOnlineOnly(id: string, onlineOnly: boolean): void {
    this.store.dispatch(
      OfferedServiceServiceActions.toggleOnlineOnly({
        id,
        onlineOnly
      })
    );
  }

  save(outletId: string): void {
    this.store.dispatch(OfferedServiceServiceActions.saveOfferedServices({ outletId }));
  }

  isEmpty(): Observable<boolean> {
    return this.store.pipe(select(offeredServiceValidationSelectors.isEmpty));
  }

  isAtLeastOneOfferedForService(serviceId: number): Observable<boolean> {
    return this.store.pipe(
      select(offeredServiceValidationSelectors.isAtLeastOneOfferedForServiceWith(serviceId))
    );
  }

  isOfferedServiceValidityMaintainedForService(serviceId: number): Observable<boolean> {
    return this.store.pipe(
      select(
        offeredServiceValidationSelectors.isOfferedServiceValidityMaintainedForServiceWith(
          serviceId
        )
      )
    );
  }

  isOfferedServiceOpeningHourMaintainedForService(serviceId: number): Observable<boolean> {
    return this.store.pipe(
      select(
        offeredServiceValidationSelectors.isOfferedServiceOpeningHoursMaintainedForServiceWith(
          serviceId
        )
      )
    );
  }

  isOfferedServiceContractsMaintainedForService(serviceId: number): Observable<boolean> {
    return this.store.pipe(
      select(
        offeredServiceValidationSelectors.isOfferedServiceContractsMaintainedForServiceWith(
          serviceId
        )
      )
    );
  }

  isOfferedServiceCommunicationsMaintainedForService(serviceId: number): Observable<boolean> {
    return this.store.pipe(
      select(
        offeredServiceValidationSelectors.isOfferedServiceCommunicationsMaintainedForServiceWith(
          serviceId
        )
      )
    );
  }

  isLoading(): Observable<boolean> {
    return this.store.pipe(select(offeredServiceSelectors.isLoading), distinctUntilChanged());
  }

  updateApplicationFor(ids: string[], application?: boolean): void {
    this.store.dispatch(
      OfferedServiceServiceActions.updateApplicationValidity({ ids, application })
    );
  }

  updateApplicationUntilFor(ids: string[], applicationValidUntil?: string | null): void {
    this.store.dispatch(
      OfferedServiceServiceActions.updateApplicationUntilValidity({
        ids,
        applicationValidUntil: applicationValidUntil
      })
    );
  }

  updateValidFromFor(ids: string[], validFrom?: string | null): void {
    this.store.dispatch(OfferedServiceServiceActions.updateValidFromValidity({ ids, validFrom }));
  }

  updateValidUntilFor(ids: string[], validUntil?: string | null): void {
    this.store.dispatch(OfferedServiceServiceActions.updateValidUntilValidity({ ids, validUntil }));
  }

  updateValidity(validityChange: ValidityChange): void {
    this.store.dispatch(OfferedServiceServiceActions.updateValidity({ validityChange }));
  }

  saveValidities(outletId: string, serviceId: number): void {
    this.getAllForServiceWith(serviceId)
      .pipe(take(1), OfferedService.mapToValidities())
      .subscribe((validities: OfferedServiceValidity[]) =>
        this.store.dispatch(
          OfferedServiceServiceActions.saveOfferedServiceValidities({ outletId, validities })
        )
      );
  }

  saveValiditiesInBatch(outletId: string, validities: OfferedServiceValidity[]): void {
    this.store.dispatch(
      OfferedServiceServiceActions.saveOfferedServiceValidities({ outletId, validities })
    );
  }

  saveValiditiesInBatchForMultipleOutlets(multiOfferedService: MultiOfferedService[]): void {
    this.store.dispatch(
      OfferedServiceServiceActions.saveOfferedServiceValiditiesForMultipleOutlets({ multiOfferedService })
    );
  }

  extractUniqueBrandProductGroups(): Observable<BrandProductGroup[]> {
    return this.store.pipe(
      select(offeredServiceSelectors.extractOfferedServiceUniqueBrandProductGroups),
      distinctUntilChanged(simpleCompare),
      shareReplay(1)
    );
  }

  fetchCompanySisterOutlets(companyId: string, serviceIds: number[]): void {
    this.store.dispatch(
      OfferedServiceServiceActions.queryCompanySisterOutlet({ companyId, serviceIds })
    );
  }

  getCompanySisterOutlets(): Observable<SisterOutlet[]> {
    return this.store.pipe(select(offeredServiceSelectors.selectSisterOutlets));
  }
  
  getCompanySisterOutletsFullResponse(): Observable<{ sisterOutlets: SisterOutlet[], offeredServices: OfferedService[] }> {
  return this.store.pipe(select(offeredServiceSelectors.selectCompanySisterOutletsFullResponse));
  }
}
