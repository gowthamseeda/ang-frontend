import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { UserService } from '../../iam/user/user.service';
import { ApiService } from '../../shared/services/api/api.service';
import { Cache } from '../../shared/util/cache';

import { ExternalKey } from './external-key.model';

export interface ExternalKeysResponse {
  externalKeys: ExternalKey[];
}

@Injectable()
export class ExternalKeyService {
  private cache: Cache<ExternalKeysResponse>;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private userAuthorizationService: UserAuthorizationService
  ) {
    this.cache = new Cache<ExternalKeysResponse>(this.apiService, this.urlFor);
  }

  getAll(businessSiteId: string): Observable<ExternalKey[]> {
    return this.cache
      .getOrLoad(businessSiteId)
      .asObservable()
      .pipe(
        map(result => (result ? result.externalKeys : [])),
        catchError(() => []),
        switchMap(externalKeys => this.setReadonlyByRestrictions(externalKeys))
      );
  }

  saveAll(businessSiteId: string, externalKeys: ExternalKey[]): Observable<any> {
    this.cache.clearFor(businessSiteId);
    return this.apiService.put(this.urlFor(businessSiteId), { externalKeys: externalKeys });
  }

  private urlFor(businessSiteId: string): string {
    return '/traits/api/v1/business-sites/' + businessSiteId + '/external-keys';
  }

  private setReadonlyByRestrictions(externalKeys: ExternalKey[]): Observable<ExternalKey[]> {
    return zip(
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['traits.externalkey.update'])
        .verify(),
      this.userService.getBrandRestrictions(),
      this.userService.getProductGroupRestrictions()
    ).pipe(
      map(([hasUpdatePermission, brandRestrictions, productGroupRestrictions]) => {
        externalKeys.forEach(externalKey => {
          if (!hasUpdatePermission) {
            externalKey.readonly = true;
            return;
          }

          const isUserPermittedForBrand =
            !externalKey.brandId || this.checkRestrictions(brandRestrictions, externalKey.brandId);
          const isUserPermittedForProductGroup =
            !externalKey.productGroupId ||
            this.checkRestrictions(productGroupRestrictions, externalKey.productGroupId);

          externalKey.readonly = !isUserPermittedForBrand || !isUserPermittedForProductGroup;
        });

        return externalKeys;
      })
    );
  }

  private checkRestrictions(restrictions: string[], restrictionValue: string): boolean {
    return restrictions.length === 0 ? true : restrictions.includes(restrictionValue);
  }
}
