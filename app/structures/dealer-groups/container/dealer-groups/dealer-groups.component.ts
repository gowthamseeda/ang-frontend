import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DealerGroups } from 'app/structures/models/dealer-group.model';
import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { BrandCode } from '../../../../traits/shared/brand-code/brand-code.model';
import { DealerGroupsService } from '../../dealer-groups.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';

export interface DealerGroupTableRow {
  country: string;
  dealerGroupId: string;
  dealerGroupName: string;
  headquarter: string;
  headquarterId: string;
  headquarterBrandCodes: BrandCode[];
  activeState: boolean;
  activeStateText: string;
  successor: string | undefined;
  successorId: string | undefined;
}

const permissions = ['structures.dealergroups.create', 'structures.dealergroups.update'];

@Component({
  selector: 'gp-dealer-groups',
  templateUrl: './dealer-groups.component.html',
  styleUrls: ['./dealer-groups.component.scss'],
  providers: [TranslateCountryPipe]
})
export class DealerGroupsComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  dealerGroupTableRows: DealerGroupTableRow[];
  isAuthorized: Observable<boolean>;

  dealerGroupsDataSource = new MatTableDataSource<DealerGroupTableRow>([]);
  dealerGroupTableColumns = [
    'country',
    'dealerGroupId',
    'dealerGroupName',
    'headquarter',
    'headquarterBrandCodes',
    'activeState',
    'successor'
  ];
  dealerGroupTableSort: any;

  private unsubscribe = new Subject<boolean>();

  constructor(
    private dealerGroupsService: DealerGroupsService,
    private snackBarService: SnackBarService,
    private userAuthorizationService: UserAuthorizationService,
    private translateService: TranslateService,
    private translateCountryPipe: TranslateCountryPipe
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.dealerGroupsService
      .getAll()
      .pipe(
        takeUntil(this.unsubscribe),
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of({} as DealerGroups);
        })
      )
      .subscribe((dealerGroups: DealerGroups) => {
        this.dealerGroupTableRows = dealerGroups.dealerGroups.map(
          dealerGroup =>
            ({
              country: dealerGroup.country.id,
              dealerGroupId: dealerGroup.dealerGroupId,
              dealerGroupName: dealerGroup.name,
              headquarter: dealerGroup.headquarter.legalName,
              headquarterId: dealerGroup.headquarter.id,
              headquarterBrandCodes: dealerGroup.headquarter.brandCodes,
              activeState: dealerGroup.active,
              activeStateText: dealerGroup.active
                ? this.translateService.instant('ACTIVE')
                : this.translateService.instant('INACTIVE'),
              successor: dealerGroup.successorGroup?.name,
              successorId: dealerGroup.successorGroup?.id
            } as DealerGroupTableRow)
        );

        this.dealerGroupsDataSource.data = this.dealerGroupTableRows || [];

        this.dealerGroupsDataSource.data.map((element, index) => {
          this.translateCountryPipe
            .transform(element.country)
            .subscribe(val => (this.dealerGroupsDataSource.data[index].country = val));
        });

        this.isLoading = false;
      });
    this.evaluateAuthorization();
    this.initTableFilterPredicate();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  @ViewChild(MatSort)
  set dealerGroupsContent(content: ElementRef) {
    this.dealerGroupTableSort = content;
    if (this.dealerGroupTableSort) {
      this.dealerGroupsDataSource.sortingDataAccessor = (
        item: DealerGroupTableRow,
        property: string
      ): string | number => item[property];

      this.dealerGroupsDataSource.sort = this.dealerGroupTableSort;
    }
  }

  filterTable(filter: string): void {
    this.dealerGroupsDataSource.filter = filter.trim().toLowerCase();
  }

  private evaluateAuthorization(): void {
    this.isAuthorized = this.userAuthorizationService.isAuthorizedFor
      .permissions(permissions)
      .verify();
  }

  private initTableFilterPredicate(): void {
    this.dealerGroupsDataSource.filterPredicate = (data: DealerGroupTableRow, filter: string) => {
      const filterCondition = this.buildFilterCondition(data, filter);
      return filterCondition.some(condition => condition);
    };
  }

  private buildFilterCondition(data: DealerGroupTableRow, filter: string): boolean[] {
    const values = Object.values(data).filter(value => {
      return typeof value === 'string';
    });

    const brandCodes = data.headquarterBrandCodes?.map(bc => bc.brandCode) || [];

    return [
      values.some((value: string) => value.toLowerCase().includes(filter)),
      brandCodes.some((code: string) => code.toLowerCase().includes(filter))
    ];
  }
}
