import { Injectable } from '@angular/core';
import { merge, Observable, of, zip } from 'rxjs';
import { map, mergeMap, retryWhen, switchMap, take } from 'rxjs/operators';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { UserService } from '../../iam/user/user.service';
import { concatRequests } from '../../shared/services/api/api.service';
import { flatten } from '../../shared/util/arrays';
import { delayedRetryStrategy } from '../../shared/util/delayed-retry-strategy';
import { Brand } from '../brand.model';
import { BrandCodeService } from '../shared/brand-code/brand-code.service';
import { AliasService } from './alias/alias.service';
import { FederalIdService } from './federal-id/federal-id.service';
import { KeyType, KeyTypeConfig, keyTypeConfigBy } from './key-type.model';
import { FlatKey, GroupedKey } from './key.model';

@Injectable()
export class KeysService {
  constructor(
    private brandCodeService: BrandCodeService,
    private userAuthorizationService: UserAuthorizationService,
    private aliasService: AliasService,
    private federalIdService: FederalIdService,
    private userService: UserService
  ) {}

  get(businessSiteId: string, countryId: string = ''): Observable<GroupedKey[]> {
    return this.getRetailHideAuthorization().pipe(
      switchMap(isHidden => {
        if (!isHidden) {
          return zip(
            this.getBrandCodes(businessSiteId),
            this.getAlias(businessSiteId, countryId),
            this.getFederalId(businessSiteId, countryId)
          ).pipe(map((keysArray: GroupedKey[][]) => keysArray.reduce(flatten, [])));
        }

        return this.getBrandCodes(businessSiteId);
      })
    );
  }

  update(businessSiteId: string, creates: FlatKey[], deletes: FlatKey[]): Observable<any> {
    return merge(
      this.updateBrandCodes(
        businessSiteId,
        creates.filter(key => key.type === KeyType.BRAND_CODE),
        deletes.filter(key => key.type === KeyType.BRAND_CODE)
      ),
      this.updateAlias(
        businessSiteId,
        creates.filter(key => key.type === KeyType.ALIAS),
        deletes.filter(key => key.type === KeyType.ALIAS)
      ),
      this.updateFederalId(
        businessSiteId,
        creates.filter(key => key.type === KeyType.FEDERAL_ID),
        deletes.filter(key => key.type === KeyType.FEDERAL_ID)
      )
    );
  }

  getUpdatableKeyTypesBy(countryId: string): Observable<KeyType[]> {
    return this.userService
      .getPermissions()
      .pipe(map(permissions => this.keyTypesBy(countryId, permissions)));
  }

  private getRetailHideAuthorization(): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['app.retail.hide'])
      .verify()
      .pipe(take(1));
  }

  private keyTypesBy(countryId: string, permissions: string[]): KeyType[] {
    return Object.keys(KeyType)
      .map(keyType => keyType as KeyType)
      .filter(type => {
        const typeConfig = keyTypeConfigBy(type);
        return (
          !typeConfig.countryRestrictions || typeConfig.countryRestrictions.includes(countryId)
        );
      })
      .filter(keyType => {
        const keyTypeConfig = keyTypeConfigBy(keyType);
        return keyTypeConfig.updatePermissions.every(permission =>
          permissions.includes(permission)
        );
      });
  }

  private getBrandCodes(businessSiteId: string): Observable<GroupedKey[]> {
    return this.getKeys(
      KeyType.BRAND_CODE,
      () => this.brandCodeService.get(businessSiteId),
      (brandCode, hasUpdatePermission) =>
        new GroupedKey(
          KeyType.BRAND_CODE,
          brandCode.brandCode,
          [new Brand(brandCode.brandId)],
          !hasUpdatePermission
        )
    );
  }

  private getAlias(businessSiteId: string, countryId: string): Observable<GroupedKey[]> {
    return this.userAuthorizationService.isAuthorizedFor
      .country(countryId)
      .verify()
      .pipe(
        take(1),
        mergeMap(hasPermission => {
          if (!hasPermission) {
            return of([]);
          }

          return this.getKeys(
            KeyType.ALIAS,
            () =>
              this.aliasService
                .get(businessSiteId)
                .pipe(map(alias => (alias && alias.alias ? [alias] : []))),
            (alias, hasUpdatePermission) =>
              new GroupedKey(KeyType.ALIAS, alias.alias, [], !hasUpdatePermission)
          );
        })
      );
  }

  private getFederalId(businessSiteId: string, countryId: string): Observable<GroupedKey[]> {
    return this.userAuthorizationService.isAuthorizedFor
      .country(countryId)
      .verify()
      .pipe(
        take(1),
        mergeMap(hasPermission => {
          if (!hasPermission) {
            return of([]);
          }

          return this.getKeys(
            KeyType.FEDERAL_ID,
            () =>
              this.federalIdService
                .get(businessSiteId)
                .pipe(map(federalId => (federalId && federalId.federalId ? [federalId] : []))),
            (federalId, hasUpdatePermission) =>
              new GroupedKey(KeyType.FEDERAL_ID, federalId.federalId, [], !hasUpdatePermission)
          );
        })
      );
  }

  private updateBrandCodes(
    businessSiteId: string,
    creates: FlatKey[],
    deletes: FlatKey[]
  ): Observable<any> {
    const updates = creates.filter(
      keyCreation =>
        deletes.find(
          keyDeletion =>
            keyCreation.brandId === keyDeletion.brandId && keyCreation.type === keyDeletion.type
        ) !== undefined
    );

    deletes = deletes.filter(
      keyDeletion =>
        updates.find(
          keyUpdate =>
            keyUpdate.brandId === keyDeletion.brandId && keyUpdate.type === keyDeletion.type
        ) === undefined
    );

    creates = creates.filter(
      keyCreation =>
        updates.find(
          keyUpdate =>
            keyUpdate.brandId === keyCreation.brandId && keyUpdate.type === keyCreation.type
        ) === undefined
    );

    return concatRequests(
      updates
        .map(value => ({ brandCode: value.key, brandId: value.brandId as string }))
        .map(value => this.brandCodeService.update(businessSiteId, value)),

      deletes
        .map(value => value.brandId as string)
        .map(value => this.brandCodeService.delete(businessSiteId, value)),

      creates
        .map(value => ({ brandCode: value.key, brandId: value.brandId as string }))
        .map(value => this.brandCodeService.create(businessSiteId, value))
    );
  }

  private updateAlias(
    businessSiteId: string,
    creates: FlatKey[],
    deletes: FlatKey[]
  ): Observable<any> {
    return concatRequests(
      deletes.map(() => this.aliasService.delete(businessSiteId)),

      creates
        .map(value => ({ alias: value.key }))
        .map(value => this.aliasService.update(businessSiteId, value))
    );
  }

  private updateFederalId(
    businessSiteId: string,
    creates: FlatKey[],
    deletes: FlatKey[]
  ): Observable<any> {
    return concatRequests(
      deletes.map(() => this.federalIdService.delete(businessSiteId)),

      creates
        .map(value => ({ federalId: value.key }))
        .map(value => this.federalIdService.update(businessSiteId, value))
    );
  }

  private getKeys<T>(
    keyType: KeyType,
    backendCall: () => Observable<T[]>,
    resourceToKeyMapper: (resource: T, hasUpdatePermission: boolean) => GroupedKey
  ): Observable<GroupedKey[]> {
    const keyTypeConfig = keyTypeConfigBy(keyType);
    return this.userAuthorizationService.isAuthorizedFor
      .permissions([keyTypeConfig.readPermission])
      .verify()
      .pipe(
        take(1),
        mergeMap(hasPermission => {
          if (!hasPermission) {
            return of([]);
          }

          return this.getKeysFromBackend(backendCall, keyTypeConfig, resourceToKeyMapper);
        })
      );
  }

  private getKeysFromBackend<T>(
    backendCall: () => Observable<T[]>,
    keyTypeConfig: KeyTypeConfig,
    resourceToKeyMapper: (resource: T, hasUpdatePermission: boolean) => GroupedKey
  ): Observable<GroupedKey[]> {
    return zip(
      backendCall(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(keyTypeConfig.updatePermissions)
        .verify(),
      this.userService.getUserDataRestrictions().pipe(map(restrictions => restrictions.Brand))
    ).pipe(
      retryWhen(delayedRetryStrategy()),
      map(([keyResources, hasUpdatePermission, brandRestrictions]) =>
        this.convertResourcesToKeys(
          keyResources,
          resourceToKeyMapper,
          hasUpdatePermission,
          keyTypeConfig.brandDependent,
          brandRestrictions
        )
      )
    );
  }

  private convertResourcesToKeys<T>(
    keyResources: T[],
    resourceToKeyMapper: (resource: T, hasUpdatePermission: boolean) => GroupedKey,
    hasUpdatePermission: boolean,
    isBrandDependent: boolean,
    brandRestrictions: string[]
  ): GroupedKey[] {
    const keys = this.groupByKey(
      keyResources.map(resource => resourceToKeyMapper(resource, hasUpdatePermission))
    );

    return hasUpdatePermission && isBrandDependent
      ? this.addReadonlyAttributesByRestrictions(keys, brandRestrictions)
      : keys;
  }

  private addReadonlyAttributesByRestrictions(
    keys: GroupedKey[],
    brandIdRestrictions: string[]
  ): GroupedKey[] {
    if (!brandIdRestrictions) {
      return keys;
    }

    this.addReadonlyAttributeToBrand(keys, brand => !brandIdRestrictions.includes(brand.brandId));

    return keys;
  }

  private addReadonlyAttributeToBrand(
    keys: GroupedKey[],
    brandFilter: (brand: any) => boolean
  ): void {
    keys.forEach(key => key.brands.forEach(brand => (brand.readonly = brandFilter(brand))));
  }

  private groupByKey(keyItems: GroupedKey[]): GroupedKey[] {
    const itemsByKey = keyItems.reduce((keyMap: Map<string, GroupedKey>, keyItem: GroupedKey) => {
      const existingItem = keyMap.get(keyItem.key);
      if (existingItem) {
        existingItem.brands = [...existingItem.brands, ...keyItem.brands];
      } else {
        keyMap.set(keyItem.key, keyItem);
      }
      return keyMap;
    }, new Map());

    return Array.from(itemsByKey.values());
  }
}
