import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { Cache } from '../../../shared/util/cache';

import { BrandCode } from './brand-code.model';

interface BrandCodesResource {
  brandCodes: BrandCode[];
}

export interface DuplicateBrandCodesResource {
  duplicateBrandCodes: DuplicateBrandCodeResource[];
}

export interface DuplicateBrandCodeResource {
  businessSiteId: string;
  brandCode: string;
  brandId: string;
}

export interface DuplicateAdamIdsResource {
  duplicateAdamIds: DuplicateAdamIdResource[];
}

export interface DuplicateAdamIdResource {
  businessSiteId: string;
  adamId: string;
  brandId: string;
}

const BASE_URL = '/traits/api/v1/business-sites/';

@Injectable({
  providedIn: 'root'
})
export class BrandCodeService {
  private cache: Cache<BrandCodesResource>;

  constructor(
    private apiService: ApiService,
    private legalStructureRoutingService: LegalStructureRoutingService
  ) {
    this.cache = new Cache<BrandCodesResource>(this.apiService, this.getUrl);
  }

  get(outletId: string): Observable<BrandCode[]> {
    return this.cache
      .getOrLoad(outletId)
      .asObservable()
      .pipe(
        map(brandCodesResource => (brandCodesResource ? brandCodesResource.brandCodes : [])),
        catchError(() => [])
      );
  }

  getBrandCodesOfOutlet(): Observable<BrandCode[]> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      switchMap(outletId => this.get(outletId))
    );
  }

  getDuplicateBrandCodesBy(outletId: string): Observable<DuplicateBrandCodesResource> {
    return this.apiService.get<DuplicateBrandCodesResource>(
      this.getDuplicateBrandCodesUrl(outletId)
    );
  }

  getDuplicateAdamIdsBy(outletId: string): Observable<DuplicateAdamIdsResource> {
    return this.apiService.get<DuplicateAdamIdsResource>(this.getDuplicateAdamIdsUrl(outletId));
  }

  create(outletId: string, brandCode: BrandCode): Observable<any> {
    this.cache.clearFor(outletId);

    const brandToCreate = { brandCode: brandCode.brandCode, brandId: brandCode.brandId };
    return this.apiService.post(this.createUrl(outletId), brandToCreate);
  }

  update(outletId: string, brandCode: BrandCode): Observable<any> {
    this.cache.clearFor(outletId);

    return this.apiService.put(this.updateUrl(outletId, brandCode.brandId), {
      brandCode: brandCode.brandCode
    });
  }

  delete(outletId: string, brandId: string): Observable<any> {
    this.cache.clearFor(outletId);

    return this.apiService.delete(this.deleteUrl(outletId, brandId));
  }

  private createUrl(outletId: string): string {
    return BASE_URL + outletId + '/brand-codes';
  }

  private updateUrl(outletId: string, brandId: string): string {
    return BASE_URL + outletId + '/brand-codes/' + brandId;
  }

  private getUrl(outletId: string): string {
    return BASE_URL + outletId + '/brand-codes';
  }

  private getDuplicateBrandCodesUrl(outletId: string): string {
    return BASE_URL + outletId + '/duplicate-brand-codes';
  }

  private getDuplicateAdamIdsUrl(outletId: string): string {
    return BASE_URL + outletId + '/duplicate-adam-ids';
  }

  private deleteUrl(outletId: string, brandId: string): string {
    return BASE_URL + outletId + '/brand-codes/' + brandId;
  }
}
