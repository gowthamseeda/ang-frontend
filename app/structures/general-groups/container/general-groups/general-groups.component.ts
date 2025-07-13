import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { MasterBrandService } from '../../../../master/brand/master-brand/master-brand.service';
import { PRODUCT_GROUP_ORDER } from '../../../../services/brand-product-group/brand-product-group.model';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { flatten, sortByReference } from '../../../../shared/util/arrays';
import { GeneralGroupsService } from '../../general-groups.service';
import {
  GeneralGroup,
  GeneralGroupBrand,
  GeneralGroupBrandProductGroupService,
  GeneralGroupProductGroup,
  GeneralGroups
} from '../../model/general-groups.model';

class GeneralGroupCombinedBrandProductGroups {
  generalGroupId: string;
  groupedBrandProductGroups: GroupedBrandProductGroups[] = [];
}

class GroupedBrandProductGroups {
  brand: GeneralGroupBrand;
  productGroups: GeneralGroupProductGroup[] = [];
}

const permissions = ['structures.generalgroups.create', 'structures.generalgroups.update'];

@Component({
  selector: 'gp-general-groups',
  templateUrl: './general-groups.component.html',
  styleUrls: ['./general-groups.component.scss'],
  providers: [TranslateCountryPipe]
})
export class GeneralGroupsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'country',
    'name',
    'brands',
    'productGroups',
    'status',
    'successor'
  ];
  dataSource = new MatTableDataSource();
  combinedBrandProductGroups: GeneralGroupCombinedBrandProductGroups[] = [];
  allProductGroupsIds: string[] = [];
  isLoading: boolean;
  isAuthorized: Observable<boolean>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private unsubscribe = new Subject<void>();

  constructor(
    private generalGroupsService: GeneralGroupsService,
    private snackBarService: SnackBarService,
    private userAuthorizationService: UserAuthorizationService,
    private translateService: TranslateService,
    private masterBrandService: MasterBrandService,
    private translateCountryPipe: TranslateCountryPipe
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSource.sort = this.sort;
    this.getGeneralGroups();
    this.evaluateAuthorization();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  brandsBy(generalGroupId: string): Observable<GeneralGroupBrand[]> {
    return this.masterBrandService
      .sort(this.filterGroupedBrandProductGroupsBy(generalGroupId), ['brand', 'id'])
      .pipe(map(groupedBrandProductGroups => groupedBrandProductGroups.map(value => value.brand)));
  }

  productGroupsBy(generalGroupId: string, brandId: string): GeneralGroupProductGroup[] {
    return this.filterGroupedBrandProductGroupsBy(generalGroupId)
      .filter((val: GroupedBrandProductGroups) => val.brand.id === brandId)
      .map((val: GroupedBrandProductGroups) => val.productGroups)
      .reduce(flatten, []);
  }

  rowContainsProductGroupId(
    generalGroupId: string,
    brandId: string,
    productGroupId: string
  ): boolean {
    return this.productGroupsBy(generalGroupId, brandId).some(
      (val: GeneralGroupProductGroup) => val.id === productGroupId
    );
  }

  filterTable(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initAllProductGroupIds(generalGroups: GeneralGroups): void {
    generalGroups.generalGroups.forEach((generalGroup: GeneralGroup) => {
      generalGroup.brandProductGroupServices?.forEach(
        (brandProductGroupService: GeneralGroupBrandProductGroupService) => {
          if (this.allProductGroupsIds.indexOf(brandProductGroupService.productGroup.id) === -1) {
            this.allProductGroupsIds.push(brandProductGroupService.productGroup.id);
          }
        }
      );
    });

    this.allProductGroupsIds = this.orderProductGroupIdsByRef(this.allProductGroupsIds);
  }

  private orderProductGroupIdsByRef(productGroupIds: string[]): string[] {
    return sortByReference<string, string>(
      productGroupIds,
      PRODUCT_GROUP_ORDER,
      (elem: string) => elem
    );
  }

  private filterGroupedBrandProductGroupsBy(generalGroupId: string): GroupedBrandProductGroups[] {
    return this.combinedBrandProductGroups
      .filter(
        (val: GeneralGroupCombinedBrandProductGroups) => val.generalGroupId === generalGroupId
      )
      .map((val: GeneralGroupCombinedBrandProductGroups) => val.groupedBrandProductGroups)
      .reduce(flatten, []);
  }

  private groupBrandProductGroups(generalGroups: GeneralGroups): void {
    this.combinedBrandProductGroups = [];

    generalGroups.generalGroups.forEach((generalGroup: GeneralGroup) => {
      const newEntry: GeneralGroupCombinedBrandProductGroups = {
        generalGroupId: generalGroup.generalGroupId,
        groupedBrandProductGroups: []
      };

      generalGroup.brandProductGroupServices?.forEach(
        (brandProductGroupService: GeneralGroupBrandProductGroupService) => {
          const brandProductGroupEntry = newEntry.groupedBrandProductGroups.find(
            value => value.brand.id === brandProductGroupService.brand.id
          );

          if (brandProductGroupEntry !== undefined) {
            brandProductGroupEntry.productGroups.push(brandProductGroupService.productGroup);
          } else {
            newEntry.groupedBrandProductGroups.push({
              brand: brandProductGroupService.brand,
              productGroups: [brandProductGroupService.productGroup]
            });
          }
        }
      );

      this.combinedBrandProductGroups.push(newEntry);
    });
  }

  private getGeneralGroups(): void {
    this.generalGroupsService
      .getAll()
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of({} as GeneralGroups);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((generalGroups: GeneralGroups) => {
        this.groupBrandProductGroups(generalGroups);
        this.initAllProductGroupIds(generalGroups);
        this.dataSource.data = this.transformToMatDataSource(generalGroups.generalGroups);
        this.isLoading = false;
      });
  }

  private evaluateAuthorization(): void {
    this.isAuthorized = this.userAuthorizationService.isAuthorizedFor
      .permissions(permissions)
      .verify();
  }

  private transformToMatDataSource(generalGroups: GeneralGroup[]): any {
    return generalGroups.map(generalGroup => {
      const dataSource = {
        status: generalGroup.active
          ? this.translateService.instant('ACTIVE')
          : this.translateService.instant('INACTIVE'),
        active: generalGroup.active,
        country: generalGroup.country.id,
        name: generalGroup.name,
        generalGroupId: generalGroup.generalGroupId,
        brandProductGroupServices: generalGroup.brandProductGroupServices,
        successor: generalGroup.successorGroup?.name,
        successorId: generalGroup.successorGroup?.id
      };

      this.translateCountryPipe
        .transform(generalGroup.country.id)
        .subscribe(val => (dataSource.country = val));
      return dataSource;
    });
  }
}
