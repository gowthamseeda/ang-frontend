import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { UserService } from '../../iam/user/user.service';
import { ApiService, concatRequests } from '../../shared/services/api/api.service';
import { Cache } from '../../shared/util/cache';
import { TaskData } from '../../tasks/task.model';
import { Brand } from '../brand.model';

import { FlatBusinessName, GroupedBusinessName } from './business-names.model';

class BusinessName {
  businessName: string;
  brandIds: string[];
  translations?: any;
}

interface BusinessNamesResponse {
  businessNames: BusinessName[];
}

const UPDATE_PERMISSIONS = 'traits.businessnames.update';
const BASE_URL = '/traits/api/v1/business-sites/';

@Injectable()
export class BusinessNamesService {
  private cache: Cache<BusinessNamesResponse>;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private userAuthorizationService: UserAuthorizationService
  ) {
    this.cache = new Cache<BusinessNamesResponse>(this.apiService, this.buildBaseUrl);
  }

  get(outletId: string): Observable<GroupedBusinessName[]> {
    return zip(
      this.getBusinessNames(outletId).pipe(map(this.groupByKey)),
      this.userService
        .getUserDataRestrictions()
        .pipe(map(dataRestrictions => dataRestrictions.Brand)),
      this.userAuthorizationService.isAuthorizedFor.permissions([UPDATE_PERMISSIONS]).verify()
    ).pipe(
      map(([businessNames, dataRestrictiondBrandIds, hasUpdatePermission]) =>
        this.addReadonlyAttributesByRestrictions(
          businessNames,
          dataRestrictiondBrandIds,
          hasUpdatePermission
        )
      )
    );
  }

  clearCache(outletId: string): void {
    this.cache.clearFor(outletId);
  }

  save(
    businessSiteId: string,
    creates: FlatBusinessName[],
    updates: FlatBusinessName[],
    deletes: FlatBusinessName[]
  ): Observable<any> {
    this.cache.clearFor(businessSiteId);
    return concatRequests(
      updates
        .map(value => this.toResourceObject(value))
        .map(value =>
          this.apiService.put(this.buildAggregateSpecificUrl(businessSiteId, value.brandId), value)
        ),
      deletes
        .map(value => this.toResourceObject(value))
        .map(value =>
          this.apiService.delete(this.buildAggregateSpecificUrl(businessSiteId, value.brandId), {
            taskData: value.taskData
          })
        ),
      creates
        .map(value => this.toResourceObject(value))
        .map(value => this.apiService.post(this.buildBaseUrl(businessSiteId), value))
    );
  }

  emptyRequest(businessSiteId: string, taskData?: TaskData): Observable<any> {
    return this.apiService.post(this.buildBaseUrl(businessSiteId, true), {
      taskData: taskData
    });
  }

  private toResourceObject(value: FlatBusinessName): any {
    return {
      businessName: value.businessName,
      taskData: value.taskData,
      brandId: value.brandId,
      translations: this.transformTranslations(value.translations)
    };
  }

  private transformTranslations(translations?: any): any {
    if (translations === undefined || translations.length === 0) {
      return undefined;
    }

    const result = {};
    translations.forEach((translation: any) => {
      Object.assign(result, { [translation.languageId]: translation.name });
    });

    return result;
  }

  private getBusinessNames(outletId: string): Observable<GroupedBusinessName[]> {
    return this.cache
      .getOrLoad(outletId)
      .asObservable()
      .pipe(
        map(result => (result ? result.businessNames : [])),
        catchError(() => []),
        map(businessNames =>
          businessNames.map((businessName: BusinessName) =>
            this.getGroupedBusinessName(businessName)
          )
        )
      );
  }

  private getGroupedBusinessName(businessName: BusinessName): GroupedBusinessName {
    return new GroupedBusinessName(
      businessName.businessName,
      businessName.brandIds.map(brandId => new Brand(brandId)),
      businessName.translations
    );
  }

  private buildBaseUrl(businessSiteId: string, empty: boolean = false): string {
    if (empty) {
      return BASE_URL + businessSiteId + '/empty-business-names';
    }
    return BASE_URL + businessSiteId + '/business-names';
  }

  private buildAggregateSpecificUrl(businessSiteId: string, brandId: string): string {
    return this.buildBaseUrl(businessSiteId) + '/' + brandId;
  }

  private groupByKey(businessNameItems: GroupedBusinessName[]): GroupedBusinessName[] {
    const itemsByKey = businessNameItems.reduce(
      (
        businessNameMap: Map<string, GroupedBusinessName>,
        businessNameItem: GroupedBusinessName
      ) => {
        const existingItem = businessNameMap.get(businessNameItem.name);
        if (existingItem) {
          existingItem.brands = [...existingItem.brands, ...businessNameItem.brands];
        } else {
          businessNameMap.set(businessNameItem.name, businessNameItem);
        }
        return businessNameMap;
      },
      new Map()
    );

    return Array.from(itemsByKey.values());
  }

  private addReadonlyAttributesByRestrictions(
    businessNames: GroupedBusinessName[],
    dataRestrictiondBrandIds: string[],
    hasUpdatePermission: boolean
  ): GroupedBusinessName[] {
    if (!dataRestrictiondBrandIds) {
      return businessNames;
    }

    this.addReadonlyAttributeToBrand(businessNames, dataRestrictiondBrandIds);
    this.addReadonlyAttributeToBusinessName(businessNames, hasUpdatePermission);

    return businessNames;
  }

  private addReadonlyAttributeToBrand(
    businessNames: GroupedBusinessName[],
    dataRestrictiondBrandIds: string[]
  ): void {
    businessNames.forEach(key =>
      key.brands.forEach(
        brand => (brand.readonly = !dataRestrictiondBrandIds.includes(brand.brandId))
      )
    );
  }

  private addReadonlyAttributeToBusinessName(
    businessNames: GroupedBusinessName[],
    hasUpatePermission: boolean
  ): void {
    businessNames.forEach(key => (key.readonly = !hasUpatePermission));
  }
}
