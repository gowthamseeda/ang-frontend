import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { uniq } from 'ramda';
import { combineLatest, Observable, of, Subject, zip, forkJoin, BehaviorSubject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';

import { AppConfigProvider } from '../../../app-config.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { BreadcrumbItem } from '../../../main/header/models/header.model';
import { BrandProductGroupValidity } from '../../../services/offered-service/brand-product-group-validity.model';
import { Service } from '../../../services/service/models/service.model';
import { BrandProductGroupsData } from '../../../services/shared/components/brand-product-groups-data-table/brand-product-groups-data-table.component';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { simpleCompare } from '../../../shared/util/simple-compare';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { CommunicationDiff, DataCluster, Status, TaskFooterEvent, Type , TaskForDisplay ,CommunicationData as TaskCommunicationData } from '../../../tasks/task.model';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { CommunicationService } from '../../communication.service';
import {
  BrandProductGroupId,
  BrandProductGroupsGroupedByBrandId
} from '../../model/brand-product-group-id.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../shared/model/constants';
import {
  CommunicationChannel,
  CommunicationChannelsChange
} from '../../model/communication-channel.model';
import {
  CommunicationData,
  CommunicationDataGroupedByOfferedServiceId,
  NoChangeCommunicationData,
  ServiceCommunicationData
} from '../../model/communication-data.model';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { OfferedService } from '../../model/offered-service.model';
import minusBrandProductGroupIds = BrandProductGroupId.minusBrandProductGroupIds;
import filterByQueryParams = CommunicationData.filterByQueryParams;

import groupByOfferedServiceId = CommunicationData.groupByOfferedServiceId;
import hasEqualFieldsAndValues = CommunicationData.hasEqualFieldsAndValues;
import { ServiceService } from '../../../services/service/services/service.service';
import { DataChangedNotificationService } from '../../../notifications/services/data-changed-notification.service';
import { CommunicationNotification } from '../../../notifications/models/notifications.model';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { UserService } from '../../../iam/user/user.service';
import { TaskWebSocketService } from '../../../tasks/service/task-websocket.service';

export interface CommunicationsQueryParams {
  serviceId: number;
  serviceCharacteristicId?: number;
  productCategoryId: number;
}

@Component({
  selector: 'gp-service-communication',
  templateUrl: './service-communication.component.html',
  styleUrls: ['./service-communication.component.scss']
})
export class ServiceCommunicationComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  service: Service;
  currentSelectedLanguage?: string;
  serviceCharacteristicName?: string;
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  breadcrumbItems: BreadcrumbItem[];
  isLoading: boolean;
  offeredServicesOfOutlet: Observable<OfferedService[]>;
  brandProductGroupsCommunicationData: Observable<
    BrandProductGroupsData<ServiceCommunicationData[]>[] | undefined
  >;
  groupedBrandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  brandProductGroupValidities: Observable<BrandProductGroupValidity[]>;
  outletId: Observable<string>;
  CommunicationFieldType = CommunicationFieldType;
  isEditable: Observable<boolean>;
  isTaskPresent: Observable<boolean>;
  openDataChangeTask: TaskForDisplay;
  tableEnabled = true;
  taskType = Type.DATA_CHANGE;
  is4RetailEnabled = false;
  taskRetrieved: boolean = false;
  communicationDiffList : TaskCommunicationData[] = [];
  showNotification = true;
  commNotification: CommunicationNotification[] = []
  isBSR: boolean = false;
  isMTR: boolean = false;
  is4RetailLoad: boolean = false;
  isUserLoad: boolean = false;
  isNotificationLoad: boolean = false;
  currentOutletId: string;
  public DataCluster = DataCluster;
  private offeredServices: OfferedService[];
  private communicationDataOfOutlet: ServiceCommunicationData[];
  private unsubscribe = new Subject<void>();
  private subcomponentValidationStatus = new Map<CommunicationFieldType, boolean>();
  private currentQueryParams: CommunicationsQueryParams;
  refreshTable$ = new BehaviorSubject<boolean>(false);
  

  constructor(
    private communicationService: CommunicationService,
    private serviceService: ServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService,
    private progressBarService: ProgressBarService,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private outletService: OutletService,
    private distributionLevelService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private userSettingsService: UserSettingsService,
    private appConfigProvider: AppConfigProvider,
    private dataChangedNotificationService: DataChangedNotificationService,
    private featureToggleService: FeatureToggleService,
    private userService: UserService,
    private taskWebSocketService: TaskWebSocketService,
  ) {
  }

  ngOnInit(): void {
    this.initializeComponent(); 
    this.subscribeTasksChanges();  
  }

  private initializeComponent() : void{
    this.featureToggleService.isFeatureEnabled('FOR_RETAIL')
      .pipe(take(1))
      .subscribe(forRetailEnabled => {
        this.is4RetailEnabled = forRetailEnabled
        this.is4RetailLoad = true
      });
      
      this.outletId = this.legalStructureRoutingService.outletIdChanges;
      this.offeredServicesOfOutlet = this.communicationService
      .getOfferedServicesOfOutlet()
      .pipe(shareReplay(1));
      
      this.initUserRole();
      this.onQueryParamChange();
      forkJoin([
        this.initUserRole(),         
        this.onQueryParamChange()   
      ]).subscribe(() => {
        this.initDataChangeTasks();
      });

  }

  private initUserRole(): void {
    this.userService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(roles => {
        this.isMTR = roles.includes('GSSNPLUS.MarketTaskResponsible');
        this.isBSR = roles.includes('GSSNPLUS.BusinessSiteResponsible');
        this.isUserLoad = true;
        this.initDataChangeTasks();
      });
  }

  initDataChangeTasks(): void {
    if (this.is4RetailEnabled) {
      if (this.isMTR || this.isBSR) {
        if (!this.taskRetrieved) {
          this.businessSiteTaskService
          .getByOutletId(this.currentOutletId)
          .pipe(take(1))
          .subscribe(data => {
            this.communicationDiffList = [];
            data.filter(
              task =>
                task.type === Type.DATA_CHANGE &&
                task.status === Status.OPEN &&
                task.dataCluster === DataCluster.COMMUNICATION_CHANNELS
              ).forEach(task => {
                this.openDataChangeTask = this.convertTaskToTaskForDisplay(task);
                this.taskType =task.type;
                const commDiff = task.diff as CommunicationDiff;
                if (commDiff && Array.isArray(commDiff.communicationDataDiff)) {
                  this.communicationDiffList = commDiff.communicationDataDiff.map(diff => ({
                    offeredServiceId: diff.offeredServiceId,
                    serviceName: diff.serviceName,
                    serviceNameTranslations: diff.serviceNameTranslations,
                    brandId: diff.brandId,
                    productGroupId: diff.productGroupId,
                    communicationFieldId: diff.communicationFieldId,
                    diff : {
                      old : diff.diff?.old ?? '',
                      new: diff.diff?.new ?? '',
                    }
                  }));
                }
              });
              
            this.taskRetrieved = true;
          });
        }
      }
    }
  }

  convertTaskToTaskForDisplay(task: any): TaskForDisplay {
    const display = new TaskForDisplay();
    display.taskId = task.taskId;
    return display;
  }

  onQueryParamChange(): void {
    combineLatest([this.outletId, this.activatedRoute.queryParams])
      .pipe(
        tap(([outletId, { productCategoryId, serviceId, serviceCharacteristicId }]) => {
          if (!productCategoryId || !serviceId) {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          }

          const queryParams = {
            productCategoryId: +productCategoryId,
            serviceId: +serviceId,
            serviceCharacteristicId: serviceCharacteristicId ? +serviceCharacteristicId : undefined
          };

          if (
            this.currentQueryParams === undefined ||
            this.currentOutletId !== outletId ||
            JSON.stringify(this.currentQueryParams) !== JSON.stringify(queryParams)
          ) {
            this.currentOutletId = outletId;
            this.currentQueryParams = queryParams;
            this.initData();
            this.reset();
            this.showNotification = true
          }
        }),
        switchMap(([, { serviceId, serviceCharacteristicId }]) => {
          return combineLatest([
            serviceCharacteristicId ? of(serviceCharacteristicId) : of(undefined),
            of(serviceId),
            this.serviceService.selectBy(serviceId),
            this.userSettingsService.getLanguageId()
          ]);
        }),
        switchMap(([serviceCharacteristicId, serviceId, service, languageId]) => {
          if (serviceCharacteristicId !== undefined) {
            this.serviceService.fetchBy(serviceCharacteristicId);
          }
          if (!service) {
            this.serviceService.fetchBy(serviceId);
          }
          return zip(
            this.serviceService.selectBy(serviceCharacteristicId),
            of(service),
            of(languageId)
          );
        })
      )
      .subscribe(
        ([serviceCharacteristic, service, languageId]: [Service, Service, string | undefined]) => {
          this.service = service;
          this.serviceCharacteristicName = serviceCharacteristic?.name;
          this.currentSelectedLanguage = languageId;
        }
      );
  }

  initData(): void {
    this.initBrandProductGroupValidity();
    this.initGroupedBrandProductGroups();
    if(this.is4RetailEnabled)
      this.initNotificationAndCommunicationData()
    else {
      this.initCommunicationData();
      this.initEditable();
    }
  }

  ngOnDestroy(): void {
    this.taskRetrieved = false;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): boolean {
    return this.saveButtonDisabled && this.cancelButtonDisabled;
  }

  upsertCommunicationDataOfOutlet(
    communicationChannelsChange: CommunicationChannelsChange,
    communicationFieldType: CommunicationFieldType,
    brandProductGroupIds: BrandProductGroupId[]
  ): void {
    this.updateCommunicationChannelValidationStatus(
      communicationFieldType,
      !communicationChannelsChange.invalid
    );
    if (!this.areAllCommunicationChannelsValid()) {
      this.disableSaveButton();
      this.disableCancelButton(false);
      return;
    }

    const offeredServiceIdsOfRow = OfferedService.containingAny(brandProductGroupIds)(
      this.offeredServices
    ).map(offeredService => offeredService.id);
    const communicationDataOfRow = this.communicationDataOfOutlet.filter(communicationData =>
      offeredServiceIdsOfRow.some(
        offeredServiceId => offeredServiceId === communicationData.offeredServiceId
      )
    );

    communicationChannelsChange.value.forEach(changedCommunicationChannel => {
      const communicationDataToUpdate = communicationDataOfRow.filter(
        communicationData =>
          communicationData.communicationFieldId === changedCommunicationChannel.id
      );
      if (communicationDataToUpdate.length > 0) {
        this.updateCommunicationData(communicationDataToUpdate, changedCommunicationChannel);
      } else {
        this.addCommunicationData(offeredServiceIdsOfRow, changedCommunicationChannel);
      }
    });

    this.updateBrandProductGroupsCommunicationData(of(this.communicationDataOfOutlet));

    this.disableSaveButton(false);
    this.disableCancelButton(false);
  }

  mergeCommunicationDataOfOutlet(
    communicationDataRows: BrandProductGroupsData<ServiceCommunicationData[]>[]
  ): void {
    this.removeCommunicationDataOfCurrentPage();
    this.addCommunicationDataOfTable(communicationDataRows);
    this.updateBrandProductGroupsCommunicationData(of(this.communicationDataOfOutlet));
    this.disableSaveButton(false);
    this.disableCancelButton(false);
  }

  save(event?: TaskFooterEvent): void {
    this.showNotification = false;
    this.communicationDataOfOutlet = this.communicationDataOfOutlet.map(data => {
      return {
        ...data,
        taskData: event?.payload
      };
    });

    let noChangeCommunicationData;
    if (event && this.communicationDataOfOutlet.length === 0 && this.offeredServices.length !== 0) {
      noChangeCommunicationData = this.getNoChangeCommunicationData(event);
    }

    this.disableSaveButton();
    this.disableCancelButton();
    this.progressBarService.start();
    this.communicationService
      .updateServiceCommunicationData(this.communicationDataOfOutlet, noChangeCommunicationData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          if (!!event) {
            this.snackBarService.showInfo('TASK_UPDATE_COMMUNICATIONS_REQUEST_SUCCESS');
          } else {
            this.snackBarService.showInfo('EDIT_COMMUNICATION_DATA_SUCCESS');
          }
        },
        error => this.snackBarService.showError(error),
        () => {
          this.progressBarService.stop();
          if (!!event) {
            this.isEditable = of(false);
            this.isTaskPresent = of(true);
          }
          this.reset()
        }
      );
  }

  reset(): void {
    this.showNotification = false;
    this.tableEnabled = false;
    this.initCommunicationData();

    this.brandProductGroupsCommunicationData.pipe(take(1)).subscribe(() => {
      this.tableEnabled = true;
    });

    this.disableSaveButton();
    this.disableCancelButton();
  }

  isUserPermittedFor(brandProductGroupIds: BrandProductGroupId[]): Observable<boolean> {
    return zip(
      ...brandProductGroupIds.map(brandProductGroup =>
        this.isUserPermittedForBrandProductGroup(
          brandProductGroup.brandId,
          brandProductGroup.productGroupId
        )
      )
    ).pipe(map(results => results.every(result => result === true)));
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  private getNoChangeCommunicationData(event?: TaskFooterEvent): NoChangeCommunicationData {
    return {
      offeredServiceId: this.offeredServices[0].id,
      taskData: event?.payload
    };
  }

  private isUserPermittedForBrandProductGroup(
    brandId: string,
    productGroupId: string
  ): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .brand(brandId)
      .productGroup(productGroupId)
      .verify();
  }

  private initCommunicationData(): void {
    this.isLoading = true;
    const communicationData = this.communicationService.getServiceCommunicationDataOfOutlet();
    this.updateBrandProductGroupsCommunicationData(communicationData);
  }

  private updateBrandProductGroupsCommunicationData(
    communicationData: Observable<ServiceCommunicationData[]>
  ): void {
    this.brandProductGroupsCommunicationData = combineLatest([
      this.getOfferedServices(),
      this.getGroupedCommunicationDataBy(communicationData),
      this.getDataChangeNotification()
    ]).pipe(
      takeUntil(this.unsubscribe),
      map(([
             offeredServices,
             groupedCommunicationData,
             communicationNotifications
           ]) =>
        offeredServices.length
          ? this.buildBrandProductGroupsCommunicationData(
            groupedCommunicationData,
            offeredServices,
            communicationNotifications
          ) : undefined
      ),
      catchError(error => {
        this.isLoading = false;
        this.snackBarService.showError(error);
        return [];
      }),
      tap(() => (this.isLoading = false))
    );
  }

  private getOfferedServices(): Observable<OfferedService[]> {
    return this.activatedRoute.queryParams.pipe(
      mergeMap(({ productCategoryId, serviceId, serviceCharacteristicId }) => {
        return this.offeredServicesOfOutlet.pipe(
          OfferedService.filterBy(
            +productCategoryId,
            +serviceId,
            serviceCharacteristicId ? +serviceCharacteristicId : undefined
          ),
          tap(offeredServices => (this.offeredServices = offeredServices))
        );
      })
    );
  }

  private getGroupedCommunicationDataBy(
    communicationData: Observable<ServiceCommunicationData[]>
  ): Observable<CommunicationDataGroupedByOfferedServiceId> {
    return combineLatest([this.getOfferedServices(), communicationData]).pipe(
      tap(
        ([, communicationDataOfOutlet]) =>
          (this.communicationDataOfOutlet = communicationDataOfOutlet)
      ),
      map(([offeredServices, communicationDataOfOutlet]) =>
        filterByQueryParams(this.currentQueryParams)([communicationDataOfOutlet, offeredServices])
      ),
      map(groupByOfferedServiceId)
    );
  }

  private getDataChangeNotification(): Observable<CommunicationNotification[]> {
    return of(this.commNotification)
  }

  private initNotificationAndCommunicationData(): void {
    if (this.isBSR) {
      this.dataChangedNotificationService.getCommunicationsNotification(
        this.currentOutletId,
        this.currentQueryParams?.serviceId
      ).pipe(take(1))
        .subscribe(commNotification => {
            this.isNotificationLoad = true;
            this.commNotification = commNotification;
            this.initCommunicationData();
            this.initEditable();
          }
        );
    } else {
      this.initCommunicationData();
      this.initEditable();
    }
  }

  private buildBrandProductGroupsCommunicationData(
    groupedCommunicationData: CommunicationDataGroupedByOfferedServiceId,
    offeredServices: OfferedService[],
    communicationNotification: CommunicationNotification[]
  ): BrandProductGroupsData<ServiceCommunicationData[]>[] {
    const brandProductGroupsCommunicationData: BrandProductGroupsData<
      ServiceCommunicationData[]
    >[] = [];

    Object.values(groupedCommunicationData).forEach(communicationData => {
      const offeredServiceOfCommunicationData = offeredServices.find(
        offeredService => offeredService.id === communicationData[0].offeredServiceId
      );
      if (!offeredServiceOfCommunicationData) {
        return;
      }

      const itemWithSameCommunicationData = brandProductGroupsCommunicationData.find(
        brandProductGroupsCommunicationDataItem =>
          hasEqualFieldsAndValues(brandProductGroupsCommunicationDataItem?.data, communicationData)
      );

      if (itemWithSameCommunicationData) {
        itemWithSameCommunicationData.brandProductGroupIds.push({
          brandId: offeredServiceOfCommunicationData.brandId,
          productGroupId: offeredServiceOfCommunicationData.productGroupId
        });
      } else {
        brandProductGroupsCommunicationData.push({
          data: communicationData.map(serviceData => {
            const diff = this.communicationDiffList.find(d =>
            d.offeredServiceId === serviceData.offeredServiceId &&
            d.communicationFieldId === serviceData.communicationFieldId &&
            d.brandId === offeredServiceOfCommunicationData.brandId &&
            d.productGroupId === offeredServiceOfCommunicationData.productGroupId
          );
          return {
            ...serviceData,
            oldvalue: diff ? diff.diff?.old : serviceData.value,
            newvalue: diff ? diff.diff?.new : serviceData.value
          };
        }),
        brandProductGroupIds: [
          {
            brandId: offeredServiceOfCommunicationData.brandId,
            productGroupId: offeredServiceOfCommunicationData.productGroupId
          }
        ]
        });
      }
    });

    brandProductGroupsCommunicationData.forEach((group) => {
      if (group.data) {
        group.data.forEach((serviceData) => {
          const matchingNotification = communicationNotification.find(
            (notif) => notif.offeredServiceId === serviceData.offeredServiceId && notif.communicationField === serviceData.communicationFieldId
          );

          if (matchingNotification) {
            if(matchingNotification.notificationType != null) {
              serviceData.dataNotification = matchingNotification.notificationType;
            } else {
              serviceData.dataNotification = ""
            }
            serviceData.taskId = matchingNotification.taskId;
          }
        });
      }
    });

    const unassignedBrandProductGroupIds = this.getUnassignedBrandProductGroupIds(
      brandProductGroupsCommunicationData,
      offeredServices
    );

    if (unassignedBrandProductGroupIds.length > 0) {
      const newCommunicationData = {
        data: undefined,
        brandProductGroupIds: unassignedBrandProductGroupIds
      } as BrandProductGroupsData<ServiceCommunicationData[]>;

      if (brandProductGroupsCommunicationData.length > 0) {
        return [...brandProductGroupsCommunicationData, newCommunicationData];
      }

      return [newCommunicationData];
    }

    return brandProductGroupsCommunicationData;
  }

  private initBrandProductGroupValidity(): void {
    this.brandProductGroupValidities = this.getOfferedServices().pipe(
      distinctUntilChanged(simpleCompare),
      map(uniq),
      map(OfferedService.mapToBrandProductGroupValidities)
    );
  }

  private initGroupedBrandProductGroups(): void {
    this.groupedBrandProductGroups = this.getOfferedServices().pipe(
      map(OfferedService.mapToBrandProductGroupIds),
      distinctUntilChanged(simpleCompare),
      map(uniq),
      map(BrandProductGroupId.groupByBrandId)
    );
  }

  private disableSaveButton(disable: boolean = true): void {
    this.saveButtonDisabled = disable;
  }

  private disableCancelButton(disable: boolean = true): void {
    this.cancelButtonDisabled = disable;
  }

  private getUnassignedBrandProductGroupIds(
    brandProductGroupsCommunicationData: BrandProductGroupsData<ServiceCommunicationData[]>[],
    offeredServices: OfferedService[]
  ): BrandProductGroupId[] {
    const brandProductGroupIdsOfCommunicationData: BrandProductGroupId[] =
      brandProductGroupsCommunicationData.reduce((brandProductGroupIds, current) => {
        return [...brandProductGroupIds, ...current.brandProductGroupIds];
      }, [] as BrandProductGroupId[]);
    const brandProductGroupIdsOfOfferedServices =
      OfferedService.mapToBrandProductGroupIds(offeredServices);
    const brandProductGroupIdsWithoutCommunicationData =
      brandProductGroupIdsOfOfferedServices.filter(
        minusBrandProductGroupIds(brandProductGroupIdsOfCommunicationData)
      );

    return brandProductGroupIdsWithoutCommunicationData;
  }

  private addCommunicationData(
    offeredServiceIds: string[],
    communicationChannelToAdd: CommunicationChannel
  ): void {
    if (communicationChannelToAdd.value.length === 0) {
      return;
    }

    offeredServiceIds.forEach(offeredServiceId =>
      this.communicationDataOfOutlet.push({
        offeredServiceId: offeredServiceId,
        communicationFieldId: communicationChannelToAdd.id,
        value: communicationChannelToAdd.value
      } as ServiceCommunicationData)
    );
  }

  private updateCommunicationData(
    communicationDataToUpdate: ServiceCommunicationData[],
    communicationChannel: CommunicationChannel
  ): void {
    communicationDataToUpdate.forEach(dataToUpdate => {
      if (communicationChannel.value.length > 0) {
        dataToUpdate.value = communicationChannel.value;
      } else {
        const communicationDataIndexToRemove = this.communicationDataOfOutlet.findIndex(
          currentCommunicationData =>
            currentCommunicationData.offeredServiceId === dataToUpdate.offeredServiceId &&
            currentCommunicationData.communicationFieldId === dataToUpdate.communicationFieldId
        );
        this.communicationDataOfOutlet.splice(communicationDataIndexToRemove, 1);
      }
    });
  }

  private removeCommunicationDataOfCurrentPage(): void {
    this.communicationDataOfOutlet = this.communicationDataOfOutlet.filter(communicationData => {
      const offeredServiceOfCommunicationData = this.offeredServices.find(
        offeredService => offeredService.id === communicationData.offeredServiceId
      );
      return !(
        offeredServiceOfCommunicationData?.serviceId === this.currentQueryParams.serviceId &&
        offeredServiceOfCommunicationData?.serviceCharacteristicId ===
          this.currentQueryParams.serviceCharacteristicId &&
        offeredServiceOfCommunicationData?.productCategoryId ===
          this.currentQueryParams.productCategoryId
      );
    });
  }

  private addCommunicationDataOfTable(
    communicationDataRows: BrandProductGroupsData<ServiceCommunicationData[]>[]
  ): void {
    communicationDataRows.forEach(communicationDataRow => {
      const offeredServiceIdsOfRow = OfferedService.containingAny(
        communicationDataRow.brandProductGroupIds
      )(this.offeredServices).map(offeredService => offeredService.id);

      communicationDataRow.data?.forEach(communicationData => {
        const communicationChannelToAdd = {
          id: communicationData.communicationFieldId,
          value: communicationData.value
        };
        this.addCommunicationData(offeredServiceIdsOfRow, communicationChannelToAdd);
      });
    });
  }

  private evaluateUserPermissions(outletId: string, countryId: string): Observable<boolean> {
    return this.distributionLevelService.getDistributionLevelsOfOutlet().pipe(
      takeUntil(this.unsubscribe),
      switchMap(distributionLevels => {
        let permission: string;
        permission = distributionLevels.includes('TEST_OUTLET')
          ? 'communications.testoutlet.update'
          : 'communications.communicationdata.update';
        return this.userAuthorizationService.isAuthorizedFor
          .permissions([permission])
          .businessSite(outletId)
          .country(countryId)
          .distributionLevels(distributionLevels)
          .verify();
      }),
      shareReplay(1)
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
    const userIsAllowedToEdit = this.outletId.pipe(
      switchMap(outletId => this.outletService.getOrLoadBusinessSite(outletId)),
      switchMap(outlet => this.evaluateUserPermissions(outlet.id, outlet.countryId))
    );

    this.isTaskPresent = combineLatest([
      userIsAllowedToEdit,
      this.outletId,
      this.activatedRoute.queryParams
    ]).pipe(
      takeUntil(this.unsubscribe),
      switchMap(([isAllowedToEdit, outletId]) =>
        isAllowedToEdit
          ? this.businessSiteTaskService.existsOpenDataChangeFor(
              outletId,
              [DataCluster.COMMUNICATION_CHANNELS],
              `serviceId=${this.currentQueryParams?.serviceId},productCategoryId=${this.currentQueryParams?.productCategoryId}`
            )
          : of(false)
      )
    );

    this.isEditable = combineLatest([userIsAllowedToEdit, this.isTaskPresent]).pipe(
      map(([isAllowedToEdit, isTaskPresent]) => isAllowedToEdit && !isTaskPresent)
    );

    this.allowEditWithoutChangesIfVerification(userIsAllowedToEdit);
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

  private subscribeTasksChanges(): void {
  this.taskWebSocketService
    .getLiveTask()
    .pipe(
      takeUntil(this.unsubscribe),
      filter(
        data =>
          data.businessSiteId === this.currentOutletId &&
          data.dataCluster === DataCluster.COMMUNICATION_CHANNELS
      )
    )
    .subscribe(_data => {
        if (_data.status === Status.OPEN) {
          this.refreshTable$.next(true); 
        }
        if (_data.id === this.openDataChangeTask?.taskId && 
        (_data.status === Status.APPROVED || _data.status === Status.DECLINED)) {
        this.isTaskPresent = of(false);
      }
    });
  }
}
