import { Injectable } from '@angular/core';
import { combineLatest, Observable, ObservableInput, of, OperatorFunction } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationService {
  private conditions: ObservableInput<boolean>[];

  constructor(private userService: UserService, private apiService: ApiService) {
    this.conditions = [];
  }

  get isAuthorizedFor(): UserAuthorizationService {
    return new UserAuthorizationService(this.userService, this.apiService);
  }

  permissions(permissions: string[]): UserAuthorizationService {
    return this.addCondition(this.userService.getPermissions().pipe(this.checkAll(permissions)));
  }

  businessSite(businessSiteId: string): UserAuthorizationService {
    return this.addCondition(
      this.userService.getBusinessSiteRestrictions().pipe(this.checkOne(businessSiteId))
    );
  }

  country(countryId: string): UserAuthorizationService {
    return this.addCondition(
      this.userService.getCountryRestrictions().pipe(this.checkOne(countryId))
    );
  }

  observableCountry(countryId: Observable<string>): UserAuthorizationService {
    return this.addCondition(
      countryId.pipe(this.observeAndCheckOne(this.userService.getCountryRestrictions()))
    );
  }

  brand(brandId: string): UserAuthorizationService {
    return this.addCondition(this.userService.getBrandRestrictions().pipe(this.checkOne(brandId)));
  }

  productGroup(productGroupId: string): UserAuthorizationService {
    return this.addCondition(
      this.userService.getProductGroupRestrictions().pipe(this.checkOne(productGroupId))
    );
  }

  distributionLevels(distributionLevels: string[]): UserAuthorizationService {
    return this.addCondition(
      this.userService.getDistributionLevelRestrictions().pipe(this.checkMany(distributionLevels))
    );
  }

  observableDistributionLevels(distributionLevels: Observable<string[]>): UserAuthorizationService {
    return this.addCondition(
      distributionLevels.pipe(
        this.observeAndCheckMany(this.userService.getDistributionLevelRestrictions())
      )
    );
  }

  verify(): Observable<boolean> {
    if (this.conditions.length === 0) {
      return of(false);
    }
    return this.assertConditionsToBeTruthy(this.conditions);
  }

  private observeAndCheckOne(
    restrictions: Observable<string[]>
  ): OperatorFunction<string, boolean> {
    return switchMap(observableCheckedItem =>
      restrictions.pipe(this.checkOne(observableCheckedItem))
    );
  }

  private checkOne(checkedItem: string): OperatorFunction<string[], boolean> {
    return map((items: string[]) => (items.length === 0 ? true : items.includes(checkedItem)));
  }

  private observeAndCheckMany(
    restrictions: Observable<string[]>
  ): OperatorFunction<string[], boolean> {
    return switchMap(observableCheckedItems =>
      restrictions.pipe(this.checkMany(observableCheckedItems))
    );
  }

  private checkMany(checkedItems: string[]): OperatorFunction<string[], boolean> {
    return map((items: string[]) =>
      items.length === 0 || checkedItems.length === 0
        ? true
        : checkedItems.some(checkedItem => items.includes(checkedItem))
    );
  }

  private checkAll(checkedItems: string[]): OperatorFunction<string[], boolean> {
    return map(items => items && checkedItems.every(checkedItem => items.includes(checkedItem)));
  }

  private addCondition(condition: ObservableInput<boolean>): UserAuthorizationService {
    this.conditions = [...this.conditions, condition];
    return this;
  }

  private assertConditionsToBeTruthy(conditions: ObservableInput<boolean>[]): Observable<boolean> {
    return combineLatest(conditions).pipe(map(values => values.every(value => value === true)));
  }
}
