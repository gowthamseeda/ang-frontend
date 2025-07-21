import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { groupBy } from 'ramda';
import { combineLatest, iif, Observable, of, Subject, zip } from 'rxjs';
import {
  catchError,
  map,
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
import { BrandProductGroupsData } from '../../../services/shared/components/brand-product-groups-data-table/brand-product-groups-data-table.component';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { ApiError } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import {
  BusinessSiteTaskService,
  TaskQueryParams
} from '../../../tasks/shared/business-site-task.service';
import { DataCluster, Status, TaskFooterEvent, Type, TaskForDisplay, GeneralCommunicationDataDiff, GeneralCommunicationData as TaskCommunicationData } from '../../../tasks/task.model';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { BrandCode } from '../../../traits/shared/brand-code/brand-code.model';
import { BrandCodeService } from '../../../traits/shared/brand-code/brand-code.service';
import { CommunicationService } from '../../communication.service';
import {
  BrandProductGroupId,
  BrandProductGroupsGroupedByBrandId
} from '../../model/brand-product-group-id.model';
import {
  CommunicationChannel,
  CommunicationChannelsChange
} from '../../model/communication-channel.model';
import { CommunicationData, GeneralCommunicationData } from '../../model/communication-data.model';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { SpokenLanguageComponent } from '../spoken-language/spoken-language.component';
import { GENERAL_COMMUNICATION_AGGREGATES } from '../../../shared/model/constants';
import minusBrandProductGroupIds = BrandProductGroupId.minusBrandProductGroupIds;
import hasEqualFieldsAndValues = CommunicationData.hasEqualFieldsAndValues;
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap
} from 'rxjs/operators';

import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { LeaveComponent } from '../../../shared/components/leave-component/leave-component.component';
import { CanComponentDeactivate } from '../../../shared/guards/can-deactivate-guard.model';
import * as fromLegalStructure from '../../../legal-structure/store';
import { LanguageService } from '../../../geography/language/language.service';

@Component({
  selector: 'gp-general-communication',
  templateUrl: './general-communication.component.html',
  styleUrls: ['./general-communication.component.scss']
})
export class GeneralCommunicationComponent extends LeaveComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  readonly generalCommunicationAggregates: string[] = GENERAL_COMMUNICATION_AGGREGATES;
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  breadcrumbItems: BreadcrumbItem[];
  isLoadingCommunicationChannels = true;
  brandProductGroupsCommunicationData: Observable<
    BrandProductGroupsData<GeneralCommunicationData[]>[]
  >;
  groupedBrandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  outletId: Observable<string>;
  brandCodes: Observable<BrandCode[]>;
  CommunicationFieldType = CommunicationFieldType;
  Type = Type;
  taskFilter: TaskQueryParams;
  openDataChangeTask: TaskForDisplay;
  showNotification: boolean = true;
  userIsAuthorizedForOutlet: Observable<boolean>;
  isTaskPresent: Observable<boolean>;
  isEditable: Observable<boolean>;
  tableEnabled = true;
  taskFilter: TaskQueryParams = {
    type: Type.DATA_CHANGE,
    dataClusters: [DataCluster.GENERAL_COMMUNICATION_CHANNELS],
    status: Status.OPEN
  };
  @ViewChild(SpokenLanguageComponent)
  spokenLanguageComponent: SpokenLanguageComponent;

  openDataChangeTask: TaskForDisplay;
  taskRetrieved: boolean = false;
  communicationDiffList: TaskCommunicationData[] = [];

  private unsubscribe = new Subject<void>();
  private communicationDataOfOutlet: GeneralCommunicationData[];
  private subcomponentValidationStatus = new Map<CommunicationFieldType, boolean>();

  constructor(
    private communicationService: CommunicationService,
    private brandCodeService: BrandCodeService,
    private progressBarService: ProgressBarService,
    private snackBarService: SnackBarService,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private outletService: OutletService,
    private distributionLevelsService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private appConfigProvider: AppConfigProvider
  ) {}

  ngOnInit(): void {
    this.outletId = this.legalStructureRoutingService.outletIdChanges;
    this.brandCodes = this.brandCodeService.getBrandCodesOfOutlet();
    this.initGroupedBrandProductGroups();
    this.initGeneralCommunicationData();
    this.initUserAuthorization();
    this.initDataChangeTasks();
  }

  initDataChangeTasks(): void {
    console.log('🔍 initDataChangeTasks: Starting to retrieve tasks');
    this.outletId.pipe(take(1)).subscribe(outletId => {
      console.log('🔍 initDataChangeTasks: outletId =', outletId);
      if (!this.taskRetrieved) {
        this.businessSiteTaskService
          .getByOutletId(outletId)
          .pipe(take(1))
          .subscribe(data => {
            console.log('🔍 initDataChangeTasks: Raw task data =', data);
            this.communicationDiffList = [];
            const filteredTasks = data.filter(
              task =>
                task.type === Type.DATA_CHANGE &&
                task.status === Status.OPEN &&
                task.dataCluster === DataCluster.GENERAL_COMMUNICATION_CHANNELS
            );
            console.log('🔍 initDataChangeTasks: Filtered tasks =', filteredTasks);

            filteredTasks.forEach(task => {
              console.log('🔍 initDataChangeTasks: Processing task =', task);
              this.openDataChangeTask = this.convertTaskToTaskForDisplay(task);
              const commDiff = task.diff as GeneralCommunicationDataDiff;
              console.log('🔍 initDataChangeTasks: Task diff =', commDiff);

              if (commDiff && Array.isArray(commDiff.generalCommunicationDataDiff)) {
                this.communicationDiffList = commDiff.generalCommunicationDataDiff.map(diff => {
                  console.log('🔍 initDataChangeTasks: Processing individual diff =', diff);
                  console.log('🔍 initDataChangeTasks: diff.diff =', diff.diff);

                  return {
                    brandId: diff.brandId,
                    communicationFieldId: diff.communicationFieldId,
                    diff: {
                      old: diff.diff?.old || '',
                      new: diff.diff?.new || '',
                    }
                  };
                });
                console.log('🔍 initDataChangeTasks: Mapped communicationDiffList =', this.communicationDiffList);
              }
            });
            this.taskRetrieved = true;
          });
      }
    });
  }

  convertTaskToTaskForDisplay(task: any): TaskForDisplay {
    const display = new TaskForDisplay();
    display.taskId = task.taskId;
    return display;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): boolean {
    return this.saveButtonDisabled && this.cancelButtonDisabled;
  }

  upsertCommunicationDataOfOutlet(
    communicationChannelsChange: CommunicationChannelsChange,
    communicationFieldType: CommunicationFieldType,
    brandProductGroupIdsOfRow: BrandProductGroupId[]
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

    const communicationDataOfRow = this.communicationDataOfOutlet.filter(communicationData =>
      brandProductGroupIdsOfRow.some(
        brandProductGroupId => brandProductGroupId.brandId === communicationData.brandId
      )
    );
    const brandIdsOfRow: string[] = brandProductGroupIdsOfRow.map(it => it.brandId);

    communicationChannelsChange.value.forEach(changedCommunicationChannel => {
      const communicationDataToUpdate = communicationDataOfRow.filter(
        communicationData =>
          communicationData.communicationFieldId === changedCommunicationChannel.id
      );
      if (communicationDataToUpdate.length > 0) {
        this.updateCommunicationData(communicationDataToUpdate, changedCommunicationChannel);
      } else {
        this.addCommunicationData(brandIdsOfRow, changedCommunicationChannel);
      }
    });

    this.updateBrandProductGroupsCommunicationData(of(this.communicationDataOfOutlet));
    this.disableSaveButton(false);
    this.disableCancelButton(false);
  }

  mergeCommunicationDataOfOutlet(
    communicationDataRows: BrandProductGroupsData<GeneralCommunicationData[]>[]
  ): void {
    this.communicationDataOfOutlet = [];
    this.addCommunicationDataOfTable(communicationDataRows);
    this.updateBrandProductGroupsCommunicationData(of(this.communicationDataOfOutlet));
    this.disableSaveButton(false);
    this.disableCancelButton(false);
  }

  save(event?: TaskFooterEvent): void {
    this.disableSaveButton();
    this.disableCancelButton();
    this.progressBarService.start();

    this.saveObservable(event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          if (!!event) {
            this.snackBarService.showInfo('TASK_UPDATE_COMMUNICATIONS_REQUEST_SUCCESS');
          } else {
            this.snackBarService.showInfo('EDIT_COMMUNICATION_DATA_SUCCESS');
          }
        },
        error => {
          this.snackBarService.showError(error);
        },
        () => {
          this.progressBarService.stop();
          // reload page if retailer, to "reset" fields. Delay because of snackbar message
          if (!!event) {
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        }
      );
  }

  reset(): void {
    this.tableEnabled = false;
    this.initGeneralCommunicationData();

    this.brandProductGroupsCommunicationData.pipe(take(1)).subscribe(() => {
      this.tableEnabled = true;
    });
    this.spokenLanguageComponent.reset();

    this.disableSaveButton();
    this.disableCancelButton();
  }

  outletNavigationClicked(): void {
    this.reset();
  }

  isUserPermittedFor(brandProductGroupIds: BrandProductGroupId[]): Observable<boolean> {
    return zip(
      ...brandProductGroupIds.map(brandProductGroup =>
        this.isUserPermittedForBrand(brandProductGroup.brandId)
      )
    ).pipe(map(results => results.every(result => result === true)));
  }

  spokenLanguageDataChanged(): void {
    this.disableCancelButton(false);
    this.disableSaveButton(false);
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  private isUserPermittedForBrand(brandId: string): Observable<boolean> {
    if (brandId === 'BRANDLESS') {
      return of(true);
    }
    return this.userAuthorizationService.isAuthorizedFor.brand(brandId).verify();
  }

  private initGeneralCommunicationData(): void {
    this.isLoadingCommunicationChannels = true;
    const dataOfOutlet = this.communicationService.getGeneralCommunicationDataOfOutlet();
    this.updateBrandProductGroupsCommunicationData(dataOfOutlet);
  }

  private updateBrandProductGroupsCommunicationData(
    dataOfOutlet: Observable<GeneralCommunicationData[]>
  ): void {
    this.brandProductGroupsCommunicationData = combineLatest([dataOfOutlet, this.brandCodes]).pipe(
      takeUntil(this.unsubscribe),
      tap(
        ([communicationData]) =>
          (this.communicationDataOfOutlet = this.adjustCommunicationData(communicationData))
      ),
      map(([communicationData, brandCodes]) =>
        this.buildBrandProductGroupsCommunicationData(communicationData, brandCodes)
      ),
      catchError(error => {
        this.isLoadingCommunicationChannels = false;
        this.snackBarService.showError(error);
        return [];
      }),
      tap(() => (this.isLoadingCommunicationChannels = false))
    );
  }

  private adjustCommunicationData(
    communicationData: GeneralCommunicationData[]
  ): GeneralCommunicationData[] {
    return communicationData.map(data => {
      if (!data.brandId) {
        data.brandId = 'BRANDLESS';
      }
      return data;
    });
  }

  private buildBrandProductGroupsCommunicationData(
    communicationData: GeneralCommunicationData[],
    brandCodes: BrandCode[]
  ): BrandProductGroupsData<GeneralCommunicationData[]>[] {
    console.log('🔍 buildBrandProductGroupsCommunicationData: Starting with communicationData =', communicationData);
    console.log('🔍 buildBrandProductGroupsCommunicationData: communicationDiffList =', this.communicationDiffList);

    const brandProductGroupsCommunicationData: BrandProductGroupsData<
      GeneralCommunicationData[]
    >[] = [];

    const communicationDataGroupedByBrandId = groupBy(
      communicationDataItem => communicationDataItem.brandId ?? 'BRANDLESS',
      communicationData
    );

    Object.values(communicationDataGroupedByBrandId).forEach(
      (generalCommunicationData: GeneralCommunicationData[]) => {
        const itemWithSameCommunicationData = brandProductGroupsCommunicationData.find(
          brandProductGroupsCommunicationDataItem =>
            hasEqualFieldsAndValues(
              brandProductGroupsCommunicationDataItem?.data,
              generalCommunicationData
            )
        );
        if (itemWithSameCommunicationData) {
          itemWithSameCommunicationData.brandProductGroupIds.push({
            brandId: generalCommunicationData[0].brandId ?? 'BRANDLESS',
            productGroupId: 'PRODUCTGROUPLESS'
          });
        } else {
          brandProductGroupsCommunicationData.push({
            data: generalCommunicationData.map(commData => {
              const targetBrandId = commData?.brandId ?? 'BRANDLESS';
              const diff = this.communicationDiffList?.find(d => {
                return d?.communicationFieldId === commData?.communicationFieldId &&
                       (d?.brandId ?? 'BRANDLESS') === targetBrandId;
              });

              console.log('🔍 buildBrandProductGroupsCommunicationData: Processing commData =', {
                brandId: targetBrandId,
                fieldId: commData?.communicationFieldId,
                foundDiff: !!diff,
                diffData: diff ? { old: diff.diff?.old, new: diff.diff?.new } : null
              });

              const hasChanges = diff && diff.diff?.old !== diff.diff?.new && diff.diff?.old !== undefined && diff.diff?.new !== undefined;

              const result = {
                ...commData,
                oldvalue: diff ? diff.diff?.old : commData?.value,
                newvalue: diff ? diff.diff?.new : commData?.value,
                futureValue: hasChanges ? diff.diff?.new : undefined,
                hasChanges: hasChanges
              };
              console.log('🔍 buildBrandProductGroupsCommunicationData: Final result object =', result);
              console.log('🔍 buildBrandProductGroupsCommunicationData: result.oldvalue =', result.oldvalue);
              console.log('🔍 buildBrandProductGroupsCommunicationData: result.newvalue =', result.newvalue);
              console.log('🔍 buildBrandProductGroupsCommunicationData: result.hasChanges =', result.hasChanges);
              return result;
            }),
            brandProductGroupIds: [
              {
                brandId: generalCommunicationData[0].brandId ?? 'BRANDLESS',
                productGroupId: 'PRODUCTGROUPLESS'
              }
            ]
          });
        }
      }
    );

    const unassignedBrandProductGroupIds = this.getUnassignedBrandProductGroupIds(
      brandProductGroupsCommunicationData,
      brandCodes
    );

    if (unassignedBrandProductGroupIds.length > 0) {
      const newCommunicationData = {
        data: undefined,
        brandProductGroupIds: unassignedBrandProductGroupIds
      } as BrandProductGroupsData<GeneralCommunicationData[]>;

      if (brandProductGroupsCommunicationData.length > 0) {
        return [...brandProductGroupsCommunicationData, newCommunicationData];
      }

      return [newCommunicationData];
    }

    return brandProductGroupsCommunicationData;
  }

  private getUnassignedBrandProductGroupIds(
    brandProductGroupsCommunicationData: BrandProductGroupsData<GeneralCommunicationData[]>[],
    brandCodes: BrandCode[]
  ): BrandProductGroupId[] {
    const brandProductGroupIdsOfCommunicationData: BrandProductGroupId[] =
      brandProductGroupsCommunicationData.reduce((brandProductGroupIds, current) => {
        return [...brandProductGroupIds, ...current.brandProductGroupIds];
      }, [] as BrandProductGroupId[]);
    const brandProductGroupIdsOfBrandCodes = brandCodes.map(
      brandCode =>
        ({ brandId: brandCode.brandId, productGroupId: 'PRODUCTGROUPLESS' } as BrandProductGroupId)
    );

    brandProductGroupIdsOfBrandCodes.push({
      brandId: 'BRANDLESS',
      productGroupId: 'PRODUCTGROUPLESS'
    } as BrandProductGroupId);

    const brandProductGroupIdsWithoutCommunicationData = brandProductGroupIdsOfBrandCodes.filter(
      minusBrandProductGroupIds(brandProductGroupIdsOfCommunicationData)
    );

    return brandProductGroupIdsWithoutCommunicationData;
  }

  private initGroupedBrandProductGroups(): void {
    this.groupedBrandProductGroups = this.brandCodes.pipe(
      map(brandCodes => {
        const brandProductGroupIds = brandCodes.map(
          brandCode =>
            ({
              brandId: brandCode.brandId,
              productGroupId: 'PRODUCTGROUPLESS'
            } as BrandProductGroupId)
        );
        brandProductGroupIds.push({ brandId: 'BRANDLESS', productGroupId: 'PRODUCTGROUPLESS' });
        return brandProductGroupIds;
      }),
      map((brandProductGroupIds: BrandProductGroupId[]) =>
        groupBy(
          brandProductGroupId => brandProductGroupId.brandId ?? 'BRANDLESS',
          brandProductGroupIds
        )
      )
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

  private disableSaveButton(disable: boolean = true): void {
    this.saveButtonDisabled = disable;
  }

  private disableCancelButton(disable: boolean = true): void {
    this.cancelButtonDisabled = disable;
  }

  private updateCommunicationData(
    communicationDataToUpdate: GeneralCommunicationData[],
    communicationChannel: CommunicationChannel
  ): void {
    communicationDataToUpdate.forEach(dataToUpdate => {
      if (communicationChannel.value.length > 0) {
        dataToUpdate.value = communicationChannel.value;
      } else {
        this.communicationDataOfOutlet = this.communicationDataOfOutlet.filter(val => {
          if (
            val.brandId === dataToUpdate.brandId &&
            val.communicationFieldId === dataToUpdate.communicationFieldId
          ) {
            return false;
          }
          return true;
        });
      }
    });
  }

  private addCommunicationData(
    brandIds: string[],
    communicationChannelToAdd: CommunicationChannel
  ): void {
    if (communicationChannelToAdd.value.length === 0) {
      return;
    }

    brandIds.forEach(brandId =>
      this.communicationDataOfOutlet.push({
        brandId: brandId,
        communicationFieldId: communicationChannelToAdd.id,
        value: communicationChannelToAdd.value
      } as GeneralCommunicationData)
    );
  }

  private addCommunicationDataOfTable(
    communicationDataRows: BrandProductGroupsData<GeneralCommunicationData[]>[]
  ): void {
    communicationDataRows.forEach(communicationDataRow => {
      communicationDataRow.data?.forEach(communicationData => {
        const communicationChannelToAdd = {
          id: communicationData.communicationFieldId,
          value: communicationData.value
        };

        const brandIds: string[] = communicationDataRow.brandProductGroupIds.map(
          brandProductGroupId => brandProductGroupId.brandId
        );

        this.addCommunicationData(brandIds, communicationChannelToAdd);
      });
    });
  }

  private evaluateUserRestrictions(outletId: string, countryId: string): Observable<boolean> {
    return this.distributionLevelsService.getDistributionLevelsOfOutlet().pipe(
      takeUntil(this.unsubscribe),
      switchMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .businessSite(outletId)
          .country(countryId)
          .distributionLevels(distributionLevels)
          .verify();
      }),
      shareReplay(1)
    );
  }

  private initUserAuthorization(): void {
    this.userIsAuthorizedForOutlet = this.outletId.pipe(
      takeUntil(this.unsubscribe),
      switchMap(outletId => zip(of(outletId), this.outletService.getOrLoadBusinessSite(outletId))),
      switchMap(([outletId, outlet]) => this.evaluateUserRestrictions(outletId, outlet.countryId))
    );

    this.isTaskPresent = combineLatest([this.userIsAuthorizedForOutlet, this.outletId]).pipe(
      switchMap(([isAllowedToEdit, outletId]) =>
        isAllowedToEdit
          ? this.businessSiteTaskService.existsOpenDataChangeFor(outletId, [
              DataCluster.GENERAL_COMMUNICATION_CHANNELS
            ])
          : of(false)
      )
    );
    let permission: string;
    this.distributionLevelsService.getDistributionLevelsOfOutlet().subscribe(distributionLevels => {
      permission = distributionLevels.includes('TEST_OUTLET')
        ? 'communications.testoutlet.update'
        : 'communications.generalcommunicationdata.update';
      this.isEditable = combineLatest([
        this.userIsAuthorizedForOutlet,
        this.userAuthorizationService.isAuthorizedFor.permissions([permission]).verify(),
        this.isTaskPresent
      ]).pipe(
        map(
          ([userIsAuthorizedForOutlet, userIsAllowedToEdit, isTaskPresent]) =>
            userIsAuthorizedForOutlet && userIsAllowedToEdit && !isTaskPresent
        )
      );
    });

    this.allowEditWithoutChangesIfVerification(this.userIsAuthorizedForOutlet);
  }

  private allowEditWithoutChangesIfVerification(userIsAllowedToEdit: Observable<boolean>): void {
    this.isAllVerificationTaskPresent(userIsAllowedToEdit).subscribe(
      isVerificationTaskPresent => (this.saveButtonDisabled = !isVerificationTaskPresent)
    );
  }

  isAllVerificationTaskPresent(userIsAllowedToEdit: Observable<boolean>) {
    return combineLatest([userIsAllowedToEdit, this.outletId]).pipe(
      switchMap(([isAllowedToEdit, outletId]) =>
        isAllowedToEdit
          ? combineLatest([
              this.businessSiteTaskService.existsOpenVerificationTaskFor(outletId, [
                DataCluster.GENERAL_COMMUNICATION_CHANNELS
              ]),
              this.businessSiteTaskService.getOpenStatusForDataVerificationTask(
                outletId,
                [],
                this.generalCommunicationAggregates
              )
            ]).pipe(
              map(
                ([isVerificationTaskPresent, verificationTaskStatus]) =>
                  isVerificationTaskPresent || this.notNullOrEmpty(verificationTaskStatus)
              ),
              startWith(false)
            )
          : of(false)
      ),
      takeUntil(this.unsubscribe)
    );
  }

  private notNullOrEmpty(arr: any[]): boolean {
    return arr && arr.length > 0;
  }

  private saveObservable(event?: TaskFooterEvent): Observable<ObjectStatus | ApiError | Error> {
    let occurredGeneralCommunicationUpdateError: ApiError | Error;
    const shouldSaveSpokenLanguage =
      this.spokenLanguageComponent.isUserAuthorizedForSpokenLanguageChange();

    return this.communicationService
      .updateGeneralCommunicationData(
        this.communicationDataOfOutlet.map(data => {
          return {
            ...data,
            taskData: event?.payload
          };
        })
      )
      .pipe(
        catchError((generalCommunicationUpdateError: ApiError | Error) => {
          if (shouldSaveSpokenLanguage) {
            occurredGeneralCommunicationUpdateError = generalCommunicationUpdateError;
            return of(generalCommunicationUpdateError);
          }
          throw generalCommunicationUpdateError;
        }),
        switchMap((updateGeneralCommunicationResponse: ObjectStatus | ApiError | Error) =>
          iif(
            () => shouldSaveSpokenLanguage,
            this.spokenLanguageComponent.saveObservable().pipe(
              catchError((spokenLanguageUpdateError: ApiError | Error) => {
                throw this.prepareMeaningfulError(
                  spokenLanguageUpdateError,
                  occurredGeneralCommunicationUpdateError
                );
              }),
              map((updateSpokenLanguageResponse: ObjectStatus) => {
                if (occurredGeneralCommunicationUpdateError) {
                  throw this.prepareMeaningfulError(occurredGeneralCommunicationUpdateError);
                }
                return updateSpokenLanguageResponse;
              })
            ),
            of(updateGeneralCommunicationResponse)
          )
        )
      );
  }

  private prepareMeaningfulError(
    error1: ApiError | Error,
    error2?: ApiError | Error
  ): ApiError | Error {
    if (error1 && error2) {
      error1.message = 'UPDATE_COMMUNICATIONS_ALL_FAILED';
      if (error1 instanceof ApiError && error2 instanceof ApiError) {
        error1.traceId += ` ${error2.traceId}`;
      }
    } else {
      error1.message = 'UPDATE_COMMUNICATIONS_ONE_OF_MULTIPLE_FAILED';
    }
    return error1;
  }
}