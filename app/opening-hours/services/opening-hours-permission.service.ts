import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../traits/distribution-levels/distribution-levels.service';
import * as fromOpeningHours from '../store/reducers';
import { Outlet } from '../store/reducers';
import { GroupedSpecialOpeningHour, selectOutlet } from '../store/selectors';
import {
  selectBrandRestrictions,
  selectIsCreateAndSaveAllowed,
  selectProductGroupRestrictions
} from '../store/selectors/permissions-selectors';

const permissionOpeningHoursUpdate = 'openinghours.openinghours.update';

@Injectable()
export class OpeningHoursPermissionService {
  private readonly isCreateAndSaveAllowed: Observable<boolean>;
  private isCreateAllowed = false;

  constructor(
    private openingHourStore: Store<fromOpeningHours.State>,
    private userAuthorizationService: UserAuthorizationService,
    private distributionLevelsService: DistributionLevelsService
  ) {
    this.isCreateAndSaveAllowed = this.isAllowed().pipe(
      switchMap((hasUpdatePermission: boolean) =>
        this.openingHourStore.pipe(
          select(selectIsCreateAndSaveAllowed, { updatePermission: hasUpdatePermission })
        )
      )
    );
    this.isCreateAndSaveAllowed.subscribe(createPermission => {
      this.isCreateAllowed = createPermission;
    });
  }

  isAllowed(): Observable<boolean> {
    return this.openingHourStore.pipe(
      select(selectOutlet),
      filter(
        (outlet: Outlet) => outlet?.businessSiteId !== undefined && outlet?.businessSiteId !== ''
      ),
      distinctUntilChanged((outletA, outletB) => outletA.businessSiteId === outletB.businessSiteId),
      switchMap((outlet: Outlet) => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions([permissionOpeningHoursUpdate])
          .businessSite(outlet.businessSiteId)
          .country(outlet.countryId)
          .observableDistributionLevels(this.distributionLevelsService.get(outlet.businessSiteId))
          .verify();
      })
    );
  }

  isDeleteSpecialOpeningHourAllowed(
    groupedSpecialOpeningHour: GroupedSpecialOpeningHour,
    restrictedBrands: string[],
    restrictedProductGroups: string[],
    isUpdateAllowed: boolean
  ): boolean {
    const bpgMetaData = groupedSpecialOpeningHour.brandProductGroupInfo.reduce(
      (accumulator, current) => {
        return {
          countDeletable:
            current.hasHours &&
            this.isAllowedByBrand(current.brandId, restrictedBrands) &&
            this.isAllowedByProductGroups(current.productGroupIds, restrictedProductGroups)
              ? accumulator.countDeletable + 1
              : accumulator.countDeletable,
          countEmpty: !current.hasHours ? accumulator.countEmpty + 1 : accumulator.countEmpty
        };
      },
      { countDeletable: 0, countEmpty: 0 }
    );

    const allEmpty = function (countEmpty: number): boolean {
      return groupedSpecialOpeningHour.brandProductGroupInfo.length === countEmpty;
    };

    const atLeastOneDeletable = function (countDeletable: number): boolean {
      return countDeletable > 0;
    };

    return (
      isUpdateAllowed &&
      (atLeastOneDeletable(bpgMetaData.countDeletable) || allEmpty(bpgMetaData.countEmpty))
    );
  }

  isCreateSpecialOpeningHourAllowed(): boolean {
    return this.isCreateAllowed;
  }

  getRestrictedBrands(): Observable<string[]> {
    return this.openingHourStore.pipe(select(selectBrandRestrictions));
  }

  getRestrictedProductGroups(): Observable<string[]> {
    return this.openingHourStore.pipe(select(selectProductGroupRestrictions));
  }

  isEditTableCellAllowed(
    brandId: string,
    productGroupIds: string[],
    restrictedBrands: string[],
    restrictedProductGroups: string[]
  ): boolean {
    return (
      this.isAllowedByBrand(brandId, restrictedBrands) &&
      this.isAllowedByProductGroups(productGroupIds, restrictedProductGroups)
    );
  }

  isMoveProductGroupAllowed(
    brandId: string,
    productGroupId: string,
    restrictedBrands: string[],
    restrictedProductGroups: string[]
  ): boolean {
    return (
      this.isAllowedByBrand(brandId, restrictedBrands) &&
      this.isAllowedByProductGroup(productGroupId, restrictedProductGroups)
    );
  }

  isSaveAllowed(): Observable<boolean> {
    return this.isCreateAndSaveAllowed;
  }

  containsRestrictedBrandProductGroupCombination(
    groupedSpecialOpeningHour: GroupedSpecialOpeningHour,
    restrictedBrands: string[],
    restrictedProductGroups: string[]
  ): boolean {
    return groupedSpecialOpeningHour.brandProductGroupInfo.some(
      bpgInfo =>
        bpgInfo.hasHours &&
        !this.isEditTableCellAllowed(
          bpgInfo.brandId,
          bpgInfo.productGroupIds,
          restrictedBrands,
          restrictedProductGroups
        )
    );
  }

  private isAllowedByBrand(brandId: string, restrictedBrands: string[]): boolean {
    return restrictedBrands.some(brand => brandId === brand) || restrictedBrands.length === 0;
  }

  private isAllowedByProductGroup(
    productGroupId: string,
    restrictedProductGroups: string[]
  ): boolean {
    return (
      restrictedProductGroups.some(productGroup => productGroup === productGroupId) ||
      restrictedProductGroups.length === 0
    );
  }

  private isAllowedByProductGroups(
    productGroupIds: string[],
    restrictedProductGroups: string[]
  ): boolean {
    return (
      restrictedProductGroups.length === 0 ||
      productGroupIds.every(element => restrictedProductGroups.includes(element))
    );
  }
}
