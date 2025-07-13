import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { mergeMap, take, takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { AppConfigProvider } from '../../../../app-config.service';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { Outlet } from '../../../../legal-structure/shared/models/outlet.model';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceVariantService } from '../../../service-variant/service-variant.service';
import { Service } from '../../models/service.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';
import { ServiceTableStatusService } from '../../services/service-table-status.service';
import { ServiceTableService } from '../../services/service-table.service';
import { ServiceService } from '../../services/service.service';
import { ServiceConfirmationComponent } from '../service-confirmation/service-confirmation.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'gp-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  isLoading: Observable<boolean>;
  outletId: string;
  outlet: Outlet;
  pristine = this.serviceTableStatusService.pristine;
  offeredServicesEmpty: Observable<boolean> = this.offeredServiceService.isEmpty();
  userHasPermissions: Observable<boolean>;
  copyOfferedServiceToggleFormGroup: UntypedFormGroup;
  isTableStatusPristine = false;
  servicesToAdd: Observable<Service[] | undefined>;
  servicesToChange: Observable<Service[] | undefined>;
  servicesToRemove: Observable<Service[] | undefined>;
  isClickedCopy = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private outletService: OutletService,
    private serviceService: ServiceService,
    private offeredServiceService: OfferedServiceService,
    private serviceVariantService: ServiceVariantService,
    private serviceTableService: ServiceTableService,
    private serviceTableStatusService: ServiceTableStatusService,
    private distributionLevelService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private serviceTableFilterService: ServiceTableFilterService,
    private formBuilder: UntypedFormBuilder,
    private appConfigProvider: AppConfigProvider,
    public multiSelectDataService: MultiSelectDataService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.serviceTableStatusService.changePristineTo(true);
    this.serviceTableStatusService.changeServiceTableSavedStatusTo(true);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): boolean {
    this.serviceTableStatusService.pristine.subscribe(isPristine => {
      this.isTableStatusPristine = this.isTableStatusPristine = isPristine;
    });
    return this.isTableStatusPristine;
  }

  initialize(): void {
    this.serviceService.fetchAll();
    this.multiSelectDataService.flushTargetBy(this.outletId);
    this.initFormGroup();
    this.initCopyOfferedServiceToggling();
    this.route.params
      .pipe(
        mergeMap(({ outletId }) => {
          this.outletId = outletId;
          return this.outletService.getOrLoadBusinessSite(outletId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(outlet => {
        this.outlet = outlet;
        this.offeredServiceService.fetchAllForOutlet(this.outletId);
        this.serviceVariantService.fetchAllBy(this.outletId);
        this.userHasPermissions = this.evaluateUserPermissions();
      });

    this.isLoading = this.serviceTableService.isDataLoading().pipe(takeUntil(this.unsubscribe));
  }

  save(): void {
    this.multiSelectDataService.multiSelectOfferedServiceList
      .pipe(take(1))
      .subscribe(multiSelectOfferedServiceList => {
        let offeredServiceAddedList = multiSelectOfferedServiceList.offeredServiceAddedList;
        const offeredServiceChangedList = multiSelectOfferedServiceList.offeredServiceChangedList;
        let offeredServiceRemovedList = multiSelectOfferedServiceList.offeredServiceRemovedList;

        offeredServiceAddedList.forEach(offeredServiceAdded => {
          offeredServiceRemovedList.forEach(offeredServiceRemoved => {
            if (offeredServiceAdded.id === offeredServiceRemoved.id) {
              offeredServiceChangedList.push(offeredServiceAdded);

              offeredServiceAddedList = offeredServiceAddedList.filter(value => {
                return value.id !== offeredServiceAdded.id;
              });

              offeredServiceRemovedList = offeredServiceRemovedList.filter(value => {
                return value.id !== offeredServiceRemoved.id;
              });
            }
          });
        });

        const serviceIdsToAdd = offeredServiceAddedList.map(
          multiSelectOfferedService => multiSelectOfferedService.serviceId
        );
        const serviceIdsToChange = offeredServiceChangedList.map(
          multiSelectOfferedService => multiSelectOfferedService.serviceId
        );
        const serviceIdsToRemove = offeredServiceRemovedList.map(
          multiSelectOfferedService => multiSelectOfferedService.serviceId
        );

        this.servicesToAdd = this.serviceService.selectAllBy(serviceIdsToAdd);
        this.servicesToChange = this.serviceService.selectAllBy(serviceIdsToChange);
        this.servicesToRemove = this.serviceService.selectAllBy(serviceIdsToRemove);

        this.servicesToAdd.pipe(take(1)).subscribe(serviceToAdd => {
          let offeredServicesToAdd: Service[] = [];
          let offeredServicesToChange: Service[] = [];
          let offeredServicesToRemove: Service[] = [];
          if (serviceToAdd !== undefined) {
            offeredServicesToAdd = serviceToAdd.map(service => {
              const brandProductGroups = offeredServiceAddedList
                .filter(offeredServiceAdded => offeredServiceAdded.serviceId == service.id)
                .map(selectedService => {
                  return {
                    brandId: selectedService.brandId,
                    productGroupId: selectedService.productGroupId
                  };
                });
              return {
                ...service,
                brandProductGroups
              };
            });
          }

          this.servicesToChange.pipe(take(1)).subscribe(serviceToChange => {
            if (serviceToChange !== undefined) {
              offeredServicesToChange = serviceToChange.map(service => {
                const brandProductGroups = offeredServiceChangedList
                  .filter(offeredServiceChanged => offeredServiceChanged.serviceId == service.id)
                  .map(selectedService => {
                    return {
                      brandId: selectedService.brandId,
                      productGroupId: selectedService.productGroupId
                    };
                  });
                return {
                  ...service,
                  brandProductGroups
                };
              });
            }

            this.servicesToRemove.pipe(take(1)).subscribe(serviceToRemove => {
              if (serviceToRemove !== undefined) {
                offeredServicesToRemove = serviceToRemove.map(service => {
                  const brandProductGroups = offeredServiceRemovedList
                    .filter(offeredServiceRemoved => offeredServiceRemoved.serviceId == service.id)
                    .map(selectedService => {
                      return {
                        brandId: selectedService.brandId,
                        productGroupId: selectedService.productGroupId
                      };
                    });
                  return {
                    ...service,
                    brandProductGroups
                  };
                });
              }

              this.matDialog.open(ServiceConfirmationComponent, {
                height: '45rem',
                data: {
                  outletId: this.outletId,
                  servicesToAdd: offeredServicesToAdd,
                  servicesToChange: offeredServicesToChange,
                  servicesToRemove: offeredServicesToRemove
                }
              });
            });
          });
        });
      });
  }

  cancel(): void {
    this.serviceTableStatusService.changeServiceTableSavedStatusTo(true);
    this.serviceTableStatusService.changePristineTo(true);
    this.offeredServiceService.fetchAllForOutlet(this.outletId);
    this.serviceTableFilterService.changePristineTo(true);
    this.multiSelectDataService.flushMultiSelectOfferedServiceList();
  }

  resetMultiSelect(): void {
    this.multiSelectDataService.flush();
    this.multiSelectDataService.flushMultiSelectOfferedServiceList();
    this.offeredServiceService.fetchAllForOutlet(this.outletId);
    this.initMultiSelectOfferedServiceList();
  }

  disableCopy(): Observable<boolean> {
    return this.multiSelectDataService.isTargetsEmpty;
  }

  enableMultiSelect(): boolean {
    return environment.settings.enableMultiSelect;
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  private evaluateUserPermissions(): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['services.offeredservice.update'])
      .businessSite(this.outletId)
      .country(this.outlet.countryId)
      .observableDistributionLevels(this.distributionLevelService.getDistributionLevelsOfOutlet())
      .verify();
  }

  private initCopyOfferedServiceToggling(): void {
    this.copyOfferedServiceToggleFormGroup
      .get('copyOfferedService')
      ?.valueChanges.subscribe((status: boolean) => {
        this.multiSelectDataService.updateStatus(status);
        if (status) {
          this.offeredServiceService.fetchAllForOutlet(this.outletId);
          this.multiSelectDataService.flushMultiSelectOfferedServiceList();
          this.initMultiSelectOfferedServiceList();
        } else {
          this.multiSelectDataService.flush()
        }
      });
  }

  private initFormGroup(): void {
    this.multiSelectDataService.copyStatus.pipe(take(1)).subscribe(status => {
      this.copyOfferedServiceToggleFormGroup = this.formBuilder.group({
        copyOfferedService: status
      });
    });
  }

  private initMultiSelectOfferedServiceList(): void {
    this.offeredServiceService.getAll().pipe(take(1))
      .subscribe(offeredServices =>
        this.multiSelectDataService.replaceOfferedServiceSelectionList(offeredServices, this.outletId)
      )
  }
}
