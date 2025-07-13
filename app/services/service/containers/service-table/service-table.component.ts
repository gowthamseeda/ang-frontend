import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import _ from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/index';
import { take, takeUntil, tap } from 'rxjs/operators';
import { UserService } from '../../../../iam/user/user.service';
import { OfferedServiceService } from '../../../../services/offered-service/offered-service.service';
import { getNormalizedString } from '../../../../shared/util/strings';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { BrandProductGroupsGroupedByBrandId } from '../../../brand-product-group/brand-product-group.model';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { MultiSelectOfferedService } from '../../models/multi-select.model';
import { ServiceFilterCriteria, ServiceTableRow } from '../../models/service-table-row.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';
import { ServiceTableStatusService } from '../../services/service-table-status.service';
import { ServiceTableService } from '../../services/service-table.service';

@Component({
  selector: 'gp-service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.scss']
})
export class ServiceTableComponent implements OnInit, OnDestroy {
  @Input() countryId: string;
  @Input() outletId: string;

  brandProductGroups: Observable<BrandProductGroupsGroupedByBrandId> =
    this.serviceTableService.brandProductGroups;
  serviceTableDataSource: MatTableDataSource<ServiceTableRow>;

  serviceTableSaved: boolean;
  isLoading: Observable<boolean>;
  currentSelectedLanguage?: string;

  private unsubscribe = new Subject<void>();
  private serviceTableRows: Observable<ServiceTableRow[]>;
  private isPristineFilter: boolean;

  constructor(
    private offeredServiceService: OfferedServiceService,
    private serviceTableStatusService: ServiceTableStatusService,
    private serviceTableService: ServiceTableService,
    private userService: UserService,
    private userSettingsService: UserSettingsService,
    private serviceTableFilterService: ServiceTableFilterService,
    private multiSelectDataService: MultiSelectDataService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.serviceTableService.isDataLoading().pipe(takeUntil(this.unsubscribe));
    this.serviceTableRows = this.serviceTableService.serviceTableRows;
    this.initUserLanguageId();
    this.checkServiceTableSavedStatus();
    this.initBrandProductGroups();
    this.initServiceTableDataSource();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  addOfferedService(offeredService: OfferedService): void {
    const multiSelectOfferedService: MultiSelectOfferedService = {
      id: offeredService.id,
      serviceId: offeredService.serviceId,
      brandId: offeredService.brandId,
      productGroupId: offeredService.productGroupId,
      serviceCharacteristicId: undefined,
      productCategoryId: offeredService.productCategoryId,
      validity: _.cloneDeep(offeredService.validity)
    };

    this.offeredServiceService.add(offeredService);
    this.multiSelectDataService.addOfferedServiceToList(multiSelectOfferedService);
  }

  removeOfferedService(id: string): void {
    this.offeredServiceService
      .get(id)
      .pipe(take(1))
      .subscribe(offeredService => {
        if (offeredService !== undefined) {
          const multiSelectOfferedService: MultiSelectOfferedService = {
            id: offeredService.id,
            serviceId: offeredService.serviceId,
            brandId: offeredService.brandId,
            productGroupId: offeredService.productGroupId,
            serviceCharacteristicId: undefined,
            productCategoryId: offeredService.productCategoryId,
            validity: _.cloneDeep(offeredService.validity)
          };
          this.multiSelectDataService.removeOfferedServiceFromList(multiSelectOfferedService);
          this.offeredServiceService.remove(id);
        }
      });
  }

  servicesFilter(filterCriteria: ServiceFilterCriteria): void {
    this.serviceTableFilterService.changePristineTo(false);
    this.serviceTableFilterService.servicesFilter(filterCriteria).subscribe(serviceTableRows => {
      this.initTableDataSource(serviceTableRows);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceTableDataSource.filter = filterValue.trim().toLowerCase();
  }

  initServiceFilterSearchDataWithMultiToggle(): void {
    this.multiSelectDataService.copyStatus.pipe(takeUntil(this.unsubscribe)).subscribe(isCopy => {
      if (isCopy) {
        this.servicesFilter({
          isOfferedService: {
            value: true,
            isEnabled: true
          }
        });
      } else {
        this.initServiceFilterSearchData();
      }
    });
  }

  private checkServiceTableSavedStatus(): void {
    this.serviceTableStatusService.serviceTableSaved
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(saved => {
        this.serviceTableSaved = saved;
      });
  }

  private initBrandProductGroups(): void {
    this.brandProductGroups = this.serviceTableService.brandProductGroups;
  }

  private initServiceTableDataSource(): void {
    this.serviceTableRows.pipe(takeUntil(this.unsubscribe)).subscribe(serviceTableRows => {
      this.initTableDataSource(serviceTableRows);
      this.initServiceFilterSearchDataWithMultiToggle();
    });
  }

  private initServiceFilterSearchData(): void {
    this.serviceTableFilterService.pristine
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(isPristine => {
        this.isPristineFilter = isPristine;
      });

    combineLatest([
      this.serviceTableRows,
      this.offeredServiceService.getAll(),
      this.serviceTableFilterService.pristineFilterCriteria
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([services, offered, filterCriteria]) => {
        this.userService
          .getCountryRestrictions()
          .pipe(
            tap(countries => {
              this.serviceTableFilterService.initServiceFilterSearchData(
                countries.includes(this.countryId) || countries.length === 0 || offered.length === 0
                  ? services
                  : services.filter(service => offered.some(o => o.serviceId === service.entry.id)),
                offered
              );

              if (this.isPristineFilter) {
                this.serviceTableFilterService.changeFilterCriteriaTo(filterCriteria);
                this.serviceTableFilterService.changePristineTo(false);
                this.servicesFilter(filterCriteria);
              }
            })
          )
          .subscribe();
      });

    combineLatest([this.serviceTableRows, this.serviceTableFilterService.filterCriteria])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([, filterCriteria]) => {
        this.servicesFilter(filterCriteria);
      });
  }

  private initTableDataSource(serviceTableRows: ServiceTableRow[]): void {
    if (serviceTableRows.length > 0) {
      this.serviceTableDataSource = new MatTableDataSource(serviceTableRows);
      this.serviceTableDataSource.filterPredicate = this.getFilterPredicate();
    }
  }

  private initUserLanguageId(): void {
    this.userSettingsService
      .getLanguageId()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languageId => (this.currentSelectedLanguage = languageId));
  }

  private getFilterPredicate(): (data: ServiceTableRow, filter: string) => boolean {
    return (data: ServiceTableRow, filter: string): boolean => {
      let dataStr = getNormalizedString(data.entry.name);
      if (
        data.entry.translations &&
        this.currentSelectedLanguage &&
        data.entry.translations[this.currentSelectedLanguage]
      ) {
        dataStr = getNormalizedString(
          data.entry.translations[this.currentSelectedLanguage].serviceName
        );
      }
      const transformedFilter = getNormalizedString(filter);
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }
}
