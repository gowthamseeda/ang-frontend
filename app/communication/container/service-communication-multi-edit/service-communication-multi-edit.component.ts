import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { uniq } from 'ramda';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { AppConfigProvider } from '../../../app-config.service';
import {CommunicationService, ServiceCommunicationUpdateItemResponse} from '../../communication.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../shared/model/constants';
import { BreadcrumbItem } from '../../../main/header/models/header.model';
import { BrandProductGroupValidity } from '../../../services/offered-service/brand-product-group-validity.model';
import { MultiSelectOfferedServiceIds } from '../../../services/service/models/multi-select.model';
import { Service } from '../../../services/service/models/service.model';
import { MultiSelectDataService } from '../../../services/service/services/multi-select-service-data.service';
import { ServiceService } from '../../../services/service/services/service.service';
import { BrandProductGroupsData } from '../../../services/shared/components/brand-product-groups-multi-edit-data-table/brand-product-groups-multi-edit-data-table.component';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { simpleCompare } from '../../../shared/util/simple-compare';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { DataCluster, TaskFooterEvent, Type } from '../../../tasks/task.model';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import {
  BrandProductGroupId,
  BrandProductGroupsGroupedByBrandId
} from '../../model/brand-product-group-id.model';
import { CommunicationChannelsChange } from '../../model/communication-channel.model';
import {
  NoChangeCommunicationData,
  ServiceCommunicationData
} from '../../model/communication-data.model';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { OfferedService } from '../../model/offered-service.model';
import { CommunicationConfirmationComponent } from '../../presentational/communication-confirmation/communication-confirmation.component';

export interface CommunicationsQueryParams {
  serviceId: number;
  serviceCharacteristicId?: number;
  productCategoryId: number;
}

@Component({
  selector: 'gp-service-communication-multi-edit',
  templateUrl: './service-communication-multi-edit.component.html',
  styleUrls: ['./service-communication-multi-edit.component.scss']
})
export class ServiceCommunicationMultiEditComponent
  implements OnInit, OnDestroy, CanDeactivateComponent {
  currentSelectedLanguage?: string;
  serviceCharacteristicName?: string;

  breadcrumbItems: BreadcrumbItem[];
  isLoading: boolean;
  offeredServicesOfOutlet: Observable<OfferedService[]>;
  brandProductGroupsCommunicationData: Observable<
    BrandProductGroupsData<ServiceCommunicationData[]>[] | undefined
  >;
  brandProductGroupValidities: Observable<BrandProductGroupValidity[]>;
  outletCommunicationData: ServiceCommunicationData[];
  blockedOfferedService: string[];
  outletId: Observable<string>;
  selectedServices: MultiSelectOfferedServiceIds[];
  services: Observable<Service[] | undefined>;
  serviceIds: number[];
  offeredServiceIds: string[];
  offeredServices: Observable<OfferedService[]>;
  brandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  serviceIsAvailable = true;
  CommunicationFieldType = CommunicationFieldType;

  isEditable: Observable<boolean>;
  isTaskPresent: Observable<boolean>;
  tableEnabled = true;
  taskType = Type.DATA_CHANGE;
  isPristine = true;

  private subcomponentValidationStatus = new Map<CommunicationFieldType, boolean>();

  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  doNotShowMultiSelectConfirmationDialog: boolean;

  private unsubscribe = new Subject<void>();

  constructor(
    private appConfigProvider: AppConfigProvider,
    private outletService: OutletService,
    private distributionLevelService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private userSettingsService: UserSettingsService,
    private multiSelectDataService: MultiSelectDataService,
    private communicationService: CommunicationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private serviceService: ServiceService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private matDialog: MatDialog,
    private progressBarService: ProgressBarService
  ) {}

  ngOnInit(): void {
    this.outletId = this.legalStructureRoutingService.outletIdChanges;
    this.initCurrentSelectedLanguage();
    this.initSelectedServices();
    this.initServiceAvailable();
    this.initEditable();
    this.initializeBrandProductGroups();
    this.initCommunicationData();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initCurrentSelectedLanguage() {
    this.userSettingsService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(userSettings => {
        this.currentSelectedLanguage = userSettings.languageId;
        this.doNotShowMultiSelectConfirmationDialog =
          userSettings.doNotShowMultiSelectConfirmationDialog
            ? userSettings.doNotShowMultiSelectConfirmationDialog : false;
      });
  }

  private initSelectedServices() {
    this.multiSelectDataService.multiSelected.pipe(take(1)).subscribe(selectedService => {
      if (!selectedService.targets.length) {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      }
      this.selectedServices = selectedService.targets;
      this.serviceIds = selectedService.targets.map(offeredService => offeredService.serviceId);
      this.offeredServiceIds = selectedService.targets.map(offeredService => offeredService.id);
    });

    this.offeredServicesOfOutlet = this.communicationService.getOfferedServicesOfOutlet();
    this.offeredServices = combineLatest([
      this.offeredServicesOfOutlet,
      this.multiSelectDataService.multiSelected
    ]).pipe(
      take(1),
      map(([offeredServicesOfOutlet, { targets }]) => {
        return offeredServicesOfOutlet.filter(offeredService =>
          targets.some(target => target.id === offeredService.id)
        );
      })
    );
  }

  private initServiceAvailable(): void {
    this.serviceService.fetchAll();
    this.services = this.serviceService.selectAllBy(this.serviceIds);

    combineLatest([this.services, this.serviceService.isLoading()]).subscribe(
      ([loadedService, isLoading]) => {
        if (!loadedService && !isLoading) {
          this.serviceIsAvailable = false;
        }
      }
    );
  }
   get aggregateField() {
      return AGGREGATE_FIELDS.COMMUNICATION_FIELDS;
    }

    get aggregateName() {
      return AGGREGATE_NAMES.COMMUNICATION_CHANNELS
    }

    get dataCluster() {
      return DataCluster.COMMUNICATION_CHANNELS
    }
  private initEditable(): void {
    this.isEditable = this.outletId.pipe(
      switchMap(outletId => this.outletService.getOrLoadBusinessSite(outletId)),
      switchMap(outlet => this.evaluateUserPermissions(outlet.id, outlet.countryId))
    );
    this.blockedOfferedService = [];
    this.selectedServices.forEach(service => {
      this.isTaskPresent = this.outletId.pipe(
        takeUntil(this.unsubscribe),
        switchMap(outletId =>
          this.businessSiteTaskService.existsOpenDataChangeFor(
            outletId,
            [DataCluster.COMMUNICATION_CHANNELS],
            `serviceId=${service.serviceId},productCategoryId=${service.productCategoryId}`
          )
        )
      );
      this.isTaskPresent.pipe(take(1)).subscribe(taskExist => {
        if (taskExist) {
          this.blockedOfferedService.push(service.id);
        }
      });
    });

    this.allowEditWithoutChangesIfVerification(this.isEditable);
  }

  private allowEditWithoutChangesIfVerification(userIsAllowedToEdit: Observable<boolean>): void {
    combineLatest([userIsAllowedToEdit, this.outletId])
      .pipe(
        switchMap(([isAllowedToEdit, outletId]) =>
          isAllowedToEdit
            ? this.businessSiteTaskService
                .existsOpenVerificationTaskFor(outletId, [DataCluster.COMMUNICATION_CHANNELS])
                .pipe(startWith(false))
            : of(false)
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        isVerificationTaskPresent => (this.saveButtonDisabled = !isVerificationTaskPresent)
      );
  }

  private initializeBrandProductGroups(): void {
    this.brandProductGroups = this.offeredServices.pipe(
      map(OfferedService.mapToBrandProductGroupIds),
      distinctUntilChanged(simpleCompare),
      map(uniq),
      map(BrandProductGroupId.groupByBrandId)
    );
  }

  initCommunicationData(): void {
    this.isLoading = true;
    this.brandProductGroupsCommunicationData = this.offeredServices.pipe(
      takeUntil(this.unsubscribe),
      map(offeredServices => {
        return [
          {
            data: undefined,
            brandProductGroupIds: OfferedService.mapToBrandProductGroupIds(offeredServices)
          } as BrandProductGroupsData<ServiceCommunicationData[]>
        ];
      }),
      catchError(error => {
        this.isLoading = false;
        this.snackBarService.showError(error);
        return [];
      }),
      tap(() => (this.isLoading = false))
    );
    this.communicationService
      .getServiceCommunicationDataOfOutlet()
      .subscribe(it => (this.outletCommunicationData = it));
  }

  private evaluateUserPermissions(outletId: string, countryId: string): Observable<boolean> {
    return this.distributionLevelService.getDistributionLevelsOfOutlet().pipe(
      takeUntil(this.unsubscribe),
      switchMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['communications.communicationdata.update'])
          .businessSite(outletId)
          .country(countryId)
          .distributionLevels(distributionLevels)
          .verify();
      }),
      shareReplay(1)
    );
  }

  canDeactivate(): boolean {
    return this.saveButtonDisabled && this.cancelButtonDisabled;
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  isUserPermittedFor(brandProductGroupIds: BrandProductGroupId[]): Observable<boolean> {
    return of(true);
  }

  upsertCommunicationDataOfOutlet(
    communicationChannelsChange: CommunicationChannelsChange,
    communicationFieldType: CommunicationFieldType,
    brandProductGroupIds: BrandProductGroupId[]
  ): void {
    this.isPristine = false;
    this.updateCommunicationChannelValidationStatus(
      communicationFieldType,
      !communicationChannelsChange.invalid
    );
    if (!this.areAllCommunicationChannelsValid()) {
      this.disableSaveButton();
      this.disableCancelButton(false);
      return;
    }
    const newCommunicationDataList: ServiceCommunicationData[] = [];
    this.offeredServiceIds.forEach(offeredServiceId => {
      communicationChannelsChange.value.forEach(changedCommunicationChannel => {
        newCommunicationDataList.push({
          communicationFieldId: changedCommunicationChannel.id,
          value: changedCommunicationChannel.value,
          offeredServiceId
        });
      });
    });

    newCommunicationDataList.forEach(newCommunicationData => {
      const existingCommunicationData = this.outletCommunicationData.find(
        it =>
          it.offeredServiceId == newCommunicationData.offeredServiceId &&
          it.communicationFieldId == newCommunicationData.communicationFieldId
      );
      if (existingCommunicationData) {
        this.updateExistingCommunicationData(existingCommunicationData, newCommunicationData);
      } else if (
        newCommunicationData.value &&
        !this.blockedOfferedService.includes(newCommunicationData.offeredServiceId)
      ) {
        this.outletCommunicationData.push(newCommunicationData);
      }
    });

    this.disableCancelButton(false);
    this.disableSaveButton(false);
  }

  private updateExistingCommunicationData(
    existingCommunicationData: ServiceCommunicationData,
    newCommunicationData: ServiceCommunicationData
  ) {
    if (!newCommunicationData.value) {
      const index = this.outletCommunicationData.indexOf(existingCommunicationData);
      this.outletCommunicationData.splice(index, 1);
    } else {
      if (!this.blockedOfferedService.includes(existingCommunicationData.offeredServiceId)) {
        existingCommunicationData.value = newCommunicationData.value;
      }
    }
  }

  private updateCommunicationChannelValidationStatus(
    communicationFieldType: CommunicationFieldType,
    valid: boolean
  ): void {
    this.subcomponentValidationStatus.set(communicationFieldType, valid);
  }

  private areAllCommunicationChannelsValid(): boolean {
    return Array.from(this.subcomponentValidationStatus.values()).every(
      communicationChannelValid => communicationChannelValid
    );
  }

  save(event?: TaskFooterEvent): void {
    this.services.pipe(takeUntil(this.unsubscribe)).subscribe(services => {
      const servicesData = services
        ?.map(service => {
          const brandProductGroups = this.selectedServices
            .filter(x => !this.blockedOfferedService.includes(x.id))
            .filter(x => x.serviceId == service.id)
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
        })
        ?.filter(x => x.brandProductGroups.length > 0);

      const blockServicesData = services
        ?.map(service => {
          const brandProductGroups = this.selectedServices
            .filter(x => this.blockedOfferedService.includes(x.id))
            .filter(x => x.serviceId == service.id)
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
        })
        ?.filter(x => x.brandProductGroups.length > 0);

      this.disableSaveButton();
      this.disableCancelButton();
      this.progressBarService.start();
      const communicationData = this.outletCommunicationData
        .filter(commData => !this.blockedOfferedService.includes(commData.offeredServiceId))
        .map(data => {
          return {
            ...data,
            taskData: event?.payload
          };
        });

      const communicationBlockData = this.outletCommunicationData
        .filter(commData => this.blockedOfferedService.includes(commData.offeredServiceId))
        .map(data => {
          return {
            ...data,
            taskData: event?.payload
          };
        });

      let noChangeCommunicationData;
      if (
        event &&
        this.outletCommunicationData.length === 0 &&
        this.offeredServiceIds.length !== 0
      ) {
        noChangeCommunicationData = this.getNoChangeCommunicationData(event);
      }
      if(this.doNotShowMultiSelectConfirmationDialog) {
        this.saveCommunications(communicationData, communicationBlockData, noChangeCommunicationData);
      } else {
        const dialogRef = this.matDialog.open(CommunicationConfirmationComponent, {
          height: '45rem',
          data: {
            communicationBlockData,
            communicationData,
            noChangeCommunicationData,
            blockServices: blockServicesData,
            services: servicesData,
            outletId: this.outletId
          }
        });

        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(saved => {
            if(saved){
              this.saveCommunications(
                communicationBlockData,
                communicationData,
                noChangeCommunicationData)
            }
            if (!!event) {
              this.isEditable = of(false);
              this.isTaskPresent = of(true);
            }
            this.progressBarService.stop();
          });
      }
    });
  }

  saveCommunications(communicationData: any, communicationBlockData: any, noChangeCommunicationData: any){
    this.communicationService
      .updateServiceCommunicationData(
        communicationData.concat(communicationBlockData),
        noChangeCommunicationData
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        result => {
          if (result.fail && result.fail.length > 0) {
            this.showFailedResults(result.fail);
          } else {
            this.showSuccessResults(result.success, noChangeCommunicationData);
          }
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }

  showSuccessResults(result: ServiceCommunicationUpdateItemResponse[], noChangeCommunication: any) {
    if (!!noChangeCommunication) {
      this.snackBarService.showInfo('TASK_UPDATE_COMMUNICATIONS_REQUEST_SUCCESS');
    } else {
      const offeredIds = result.map(item => `[${item.offeredServiceId}]`).join(',');
      this.snackBarService.showInfoWithData('EDIT_COMMUNICATION_DATA_SUCCESS', offeredIds);
    }
  }

  showFailedResults(result: ServiceCommunicationUpdateItemResponse[]) {
    const errors = result
      .map(item => {
        if (item.messages) {
          return `[${item.offeredServiceId}]: ${item.messages.join(',')}`;
        } else {
          return `[${item.offeredServiceId}]`;
        }
      })
      .join('\n');
    this.snackBarService.displayMessageWithLengthLimit(errors);
  }

  private getNoChangeCommunicationData(event?: TaskFooterEvent): NoChangeCommunicationData {
    return {
      offeredServiceId: this.offeredServices[0].id,
      taskData: event?.payload
    };
  }

  reset(): void {
    this.isPristine = true;
    this.initCommunicationData();

    this.disableSaveButton();
    this.disableCancelButton();
  }

  disableSaveButton(disable: boolean = true) {
    this.saveButtonDisabled = disable;
  }

  disableCancelButton(disable: boolean = true) {
    this.cancelButtonDisabled = disable;
  }

  highlightOfferedService(serviceId?: number) {
    this.multiSelectDataService.updateHoveredService(serviceId);
  }
}
