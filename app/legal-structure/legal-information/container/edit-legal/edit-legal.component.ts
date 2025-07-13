import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DataCluster,
  Status,
  Task,
  TaskFooterEvent,
  TaskForDisplay,
  Type,
  VerificationTaskFormStatus
} from 'app/tasks/task.model';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { LanguageService } from '../../../../geography/language/language.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { BusinessSiteStoreService } from '../../../businessSite/services/business-site-store.service';
import { ActiveLanguageService } from '../../../shared/components/language-toggle/active-language.service';
import {
  LegalContract,
  LegalInformation,
  LegalInformationPermissions,
  ViewEventStatus
} from '../../model/legal-information.model';
import {
  LegalContractSelection
} from '../../presentational/edit-legal/legal-contract-state-table/legal-contract-state-table.component';
import { LegalInformationActionService } from '../../services/legal-information-action.service';

import { UserService } from 'app/iam/user/user.service';
import { DataChangedNotificationService } from '../../../../notifications/services/data-changed-notification.service';
import { AGGREGATE_FIELDS, LEGAL_INFO_AGGREGATES } from '../../../../shared/model/constants';
import { TaskWebSocketService } from '../../../../tasks/service/task-websocket.service';
import { BusinessSiteTaskService } from '../../../../tasks/shared/business-site-task.service';
import { EditLegalComponentViewState } from './edit-legal-component-view-state';
import { EditLegalComponentService } from './edit-legal-component.service';
import {
  DataNotification,
  DataNotificationTaskStatus
} from '../../../../notifications/models/notifications.model';

@Component({
  selector: 'gp-edit-legal',
  templateUrl: './edit-legal.component.html',
  styleUrls: ['./edit-legal.component.scss']
})
export class EditLegalComponent implements OnInit, OnDestroy {
  readonly outletPermissions = ['legalstructure.businesssite.update'];
  readonly companyPermissions = ['legalstructure.company.update'];
  readonly testOutletPermissions = ['legalstructure.testoutlet.update'];
  readonly contractStatusReadPermissions = ['traits.contractstatus.read'];
  readonly contractStatusUpdatePermissions = ['traits.contractstatus.update'];
  readonly requiredPermissions = [
    ...this.outletPermissions,
    ...this.companyPermissions,
    ...this.testOutletPermissions
  ];
  readonly pureLanguageLetterCount = 2;
  readonly LEGAL_AGGREGATES = LEGAL_INFO_AGGREGATES;
  readonly dataClusters = [
    DataCluster.LEGAL_VAT_NO,
    DataCluster.LEGAL_TAX_NO,
    DataCluster.LEGAL_LEGAL_FOOTER
  ];

  authorizedForBusinessSite = false;
  authorizedForCountry = false;
  authorizedForDistributionLevel = false;
  editLegalInfoIsAllowed = false;
  retailVerifyData = false;
  isUserAuthorizedForVerificationTask = false;
  viewState: EditLegalComponentViewState;
  outletCountryId: string;
  hasRequiredDistributionLevel = false;
  contractBrandAllowedOptions: LegalContractSelection[] = [];
  contractCompanyRelationAllowedOptions: LegalContractSelection[] = [];
  contractLanguageAllowedOptions: LegalContractSelection[] = [];
  contractRequiredAllowedOptions: LegalContractSelection[];
  isTaskPresent = false;
  isVerificationTaskPresent: boolean;
  taskType: Type = Type.DATA_CHANGE;
  taskStatusEvaluated = false;
  focusEnabled = false;
  contractStatusDowntimeEnabled = false;
  isMTR = false;
  isBSR = false;
  dataDirectChangeNotificationsMap: { [key: string]: boolean } = {};
  dataApprovedNotificationsMap: { [key: string]: boolean } = {};
  dataDeclinedNotificationsMap: { [key: string]: number | undefined } = {};
  verificationTasksStatusMap: { [key: string]: VerificationTaskFormStatus } = {};
  dataChangedFields: string[] = ['TAX_NO', 'VAT_NO', 'LEGAL_FOOTER'];
  dataClusterFields: string[] = ['LEGAL_TAX_NO', 'LEGAL_VAT_NO', 'LEGAL_LEGAL_FOOTER'];
  dataAggregateFields: string[] = ['taxNo', 'vatNo', 'legalFooter'];
  dataDirectChangeAvailable: boolean = false;
  dataApprovedAvailable: boolean = false;
  dataDeclinedAvailable: boolean = false;
  approvedFields: string[] = [];
  directChangeFields: string[] = [];
  declinedFields: string[] = [];
  dataChangeTaskList: Task[] | undefined;
  taskForDisplay: TaskForDisplay = new TaskForDisplay();
  activeTasks: Task[] = [];
  openTasks: Task[] = [];
  isForRetailEnabled: boolean;
  dataNotification: DataNotification[] = [];
  isOutletRetailer: boolean = false;
  isRO: boolean = false

  private unsubscribe = new Subject<void>();

  constructor(
    private actionService: LegalInformationActionService,
    private businessSiteStoreService: BusinessSiteStoreService,
    private legalInformationService: EditLegalComponentService,
    private formBuilder: UntypedFormBuilder,
    private activeLanguageService: ActiveLanguageService,
    private languageService: LanguageService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private featureToggleService: FeatureToggleService,
    private userService: UserService,
    private dataChangedNotificationService: DataChangedNotificationService,
    private taskWebSocketService: TaskWebSocketService
  ) {
    this.viewState = new EditLegalComponentViewState(this.formBuilder, this.featureToggleService);
    this.contractRequiredAllowedOptions = [
      { value: false, text: 'LEGAL_CONTRACT_STATUS_NOT_REQUIRED' },
      { value: true, text: 'LEGAL_CONTRACT_STATUS_REQUIRED' }
    ];
  }

  get saveButtonDisabled(): boolean {
    if (this.isVerificationTaskPresent && this.viewState.formValid) {
      return !this.isVerificationTaskPresent && this.viewState.formValid;
    }
    return !(this.viewState.formChanged && this.viewState.formValid);
  }

  get cancelButtonDisabled(): boolean {
    return !this.viewState.formChanged;
  }

  get outletDataReadOnly(): boolean {
    if (this.isTaskPresent && !this.isForRetailEnabled) {
      return true;
    }
    return (
      !this.authorizedForBusinessSite ||
      !this.editLegalInfoIsAllowed ||
      !this.authorizedForCountry ||
      !this.authorizedForDistributionLevel
    );
  }

  get companyDataReadOnly(): boolean {
    const registeredOffice = this.viewState.registeredOffice;
    if (this.isTaskPresent && !this.isForRetailEnabled) {
      return true;
    }
    return !(
      registeredOffice &&
      this.editLegalInfoIsAllowed &&
      this.authorizedForBusinessSite &&
      this.authorizedForCountry &&
      this.authorizedForDistributionLevel
    );
  }

  get legalContractIsVisible(): boolean {
    const isEditableOrHasContracts = !this.outletDataReadOnly || this.legalContractHasData;
    return this.hasRequiredDistributionLevel && isEditableOrHasContracts;
  }

  get legalContractHasData(): boolean {
    return this.viewState.legalContractsCount > 0;
  }

  ngOnInit(): void {
    window.onbeforeunload = () => this.ngOnDestroy();

    this.initializeLegalInfo();

    this.checkPermissionAndEvaluateTaskStatus();

    this.languageService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languages => {
        this.contractLanguageAllowedOptions = languages
          .filter(language => language.id.length === this.pureLanguageLetterCount)
          .map(language => ({ text: language.name, value: language.id }))
          .sort((first: LegalContractSelection, second: LegalContractSelection) =>
            first.text.localeCompare(second.text)
          );
      });

    this.activeLanguageService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        language =>
          (this.viewState.activeLanguage =
            !language.isDefaultLanguage && language.languageId ? language.languageId : '')
      );

    this.userService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(roles => {
        this.isMTR = roles.includes('GSSNPLUS.MarketTaskResponsible');
        this.isBSR = roles.includes('GSSNPLUS.BusinessSiteResponsible');
      });

    this.featureToggleService.isFeatureEnabled('FOR_RETAIL').subscribe(forRetailEnabled => {
      this.isForRetailEnabled = forRetailEnabled;
      if (forRetailEnabled) {
        this.evaluateVerificationTasks();
        this.evaluateDataChangeTasks();
        this.retrieveDataChangedNotification();
        this.subscribeDataChangeTasks();
      }
    });
  }

  ngOnDestroy(): void {
    this.markNotificationAsRead();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return !this.viewState.formChanged;
  }

  isDeactivated(deactivate: boolean): void {
    if (deactivate) {
      this.actionService.dispatchResetSavingStatus();
    }
  }

  saveButtonClicked(event?: TaskFooterEvent): void {
    this.taxNumberChanged();
    this.vatNumberAndLegalFooterChanged();

    setTimeout(() => {
      this.actionService.dispatchSaveAction(event?.payload);
      this.viewState.legalInformationControl.markAsPristine();

      if (!!event) {
        this.isTaskPresent = true;
      }
    }, 750);

    this.retailVerifyData = false;
  }

  cancelButtonClicked(): void {
    this.actionService.dispatchCancelAction(this.viewState.businessSiteId);
    this.viewState.legalInformationControl.markAsPristine();
  }

  viewButtonClicked(): void {
    setTimeout(() => {
      const element = document.getElementById('legalInfo');
      if (element) {
        element.scrollIntoView();
      }
    }, 250);
  }

  taxNumberChanged(): void {
    const legalBusinessSite = this.viewState.legalInformation.businessSite;
    this.actionService.dispatchUpdateLegalBusinessSiteAction(legalBusinessSite);
  }

  vatNumberAndLegalFooterChanged(): void {
    const legalCompany = this.viewState.legalInformation.company;
    this.actionService.dispatchUpdateLegalCompanyAction(legalCompany);
  }

  evaluateVerificationTasks() {
    this.dataChangedFields.forEach(field => {
      this.verificationTasksStatusMap[field] = VerificationTaskFormStatus.NOT_PRESENT;
    });
    this.businessSiteTaskService.getByOutletId(this.viewState.businessSiteId)
      .subscribe(tasks => {
        const filteredTasks = tasks.filter(task => task.type === Type.DATA_VERIFICATION);
        this.verificationTasksStatusMap['TAX_NO'] = this.getVerificationTaskStatus(
          filteredTasks,
          DataCluster.LEGAL_TAX_NO,
          AGGREGATE_FIELDS.LEGAL_INFO_TAX_NUMBER
        );
        this.verificationTasksStatusMap['VAT_NO'] = this.getVerificationTaskStatus(
          filteredTasks,
          DataCluster.LEGAL_VAT_NO,
          AGGREGATE_FIELDS.LEGAL_INFO_VAT_NUMBER
        );
        this.verificationTasksStatusMap['LEGAL_FOOTER'] = this.getVerificationTaskStatus(
          filteredTasks,
          DataCluster.LEGAL_LEGAL_FOOTER,
          AGGREGATE_FIELDS.LEGAL_INFO_LEGAL_FOOTER
        );
      });
  }

  getVerificationTaskStatus(
    filteredTasks: Task[],
    dataCluster: DataCluster,
    aggregateField: string
  ): VerificationTaskFormStatus {
    if (filteredTasks.some(task =>
      task.dataCluster === dataCluster ||
      task.aggregateField === aggregateField)) {
      return VerificationTaskFormStatus.PENDING;
    } else {
      return VerificationTaskFormStatus.NOT_PRESENT;
    }
  }

  evaluateDataChangeTasks(): void {
    if (this.viewState.businessSiteId) {
      combineLatest([
        this.businessSiteTaskService.getOpenStatusForDataChangeTask(
          this.viewState.businessSiteId,
          this.dataClusters
        ),
        this.businessSiteTaskService.getOpenStatusForDataChangeTask(
          this.viewState.businessSiteId,
          [],
          null,
          this.LEGAL_AGGREGATES
        )
      ])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(([dataChangeTaskPresentByDataCluster, dataChangeTaskPresentByAggregate]) => {
          this.activeTasks = dataChangeTaskPresentByDataCluster.concat(
            dataChangeTaskPresentByAggregate
          );
          this.openTasks = this.activeTasks.filter(task => task.status === Status.OPEN);
        });
    }
  }

  subscribeDataChangeTasks(): void {
    this.taskWebSocketService
      .getLiveTask()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(
          data =>
            data.businessSiteId === this.viewState.businessSiteId
            && (
              (data.aggregateField != undefined && this.dataAggregateFields.includes(data.aggregateField))
              || (data.dataCluster != undefined && this.dataClusterFields.includes(data.dataCluster))
            )
        )
      )
      .subscribe(data => {
        this.markNotificationAsRead();
        this.cancelButtonClicked();
        this.initializeLegalInfo();
        this.evaluateTaskStatus();
        this.evaluateDataChangeTasks();
        this.evaluateVerificationTasks();

        setTimeout(() => {
          this.retrieveDataChangedNotification();
        }, 2000);
      });
  }

  initializeLegalInfo(): void {
    this.legalInformationService
      .getLegalInformation()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((legalInfo: LegalInformation) => {
        const contracts = legalInfo.legalContracts;
        const contractsCountChanged = this.viewState.legalContractsCount !== contracts.length;
        const businessSiteChanged = this.viewState.businessSiteId !== legalInfo.businessSite.id;
        this.hasRequiredDistributionLevel = legalInfo.businessSite.hasRequiredDistributionLevel;
        this.viewState.legalInformation = legalInfo;

        if (
          businessSiteChanged ||
          contractsCountChanged ||
          legalInfo.viewStatus === ViewEventStatus.CONTENT_LOADED
        ) {
          this.viewState.legalContracts = contracts;
        }
        if (businessSiteChanged) {
          this.viewState.legalInformationControl.markAsPristine();

          if (this.taskStatusEvaluated) {
            this.taskStatusEvaluated = false;
            this.isTaskPresent = false;
            this.checkPermissionAndEvaluateTaskStatus();
          }
        }
      });
  }

  retrieveDataChangedNotification(): void {
    this.approvedFields = [];
    this.directChangeFields = [];
    this.declinedFields = [];

    this.dataChangedFields.forEach(field => {
      this.dataDirectChangeNotificationsMap[field] = false;
      this.dataDeclinedNotificationsMap[field] = undefined;
      this.dataApprovedNotificationsMap[field] = false;
    });
    if (this.isBSR) {
      this.dataChangedNotificationService
        .get(this.viewState.businessSiteId, this.viewState.legalInformation.company.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(notifications => {
          this.resetNotification();
          this.dataNotification = notifications;
          if (notifications.length > 0) {
            notifications.forEach(notification => {
                if (notification.taskStatus == DataNotificationTaskStatus.DIRECT_CHANGE) {
                  this.dataDirectChangeNotificationsMap[notification.changedField] = true;
                  this.dataDirectChangeAvailable = true;
                  this.directChangeFields.push(notification.changedField);
                } else if (notification.taskStatus == DataNotificationTaskStatus.APPROVED) {
                  this.dataApprovedNotificationsMap[notification.changedField] = true;
                  this.dataApprovedAvailable = true;
                  this.approvedFields.push(notification.changedField);
                } else if (notification.taskStatus == DataNotificationTaskStatus.DECLINED) {
                  this.dataDeclinedNotificationsMap[notification.changedField] = notification.taskId;
                  this.dataDeclinedAvailable = true;
                  this.declinedFields.push(notification.changedField);
                }
              }
            );
          }
        });
    }
  }

  resetNotification(): void {
    this.dataDirectChangeNotificationsMap = {};
    this.dataApprovedNotificationsMap = {};
    this.dataDeclinedNotificationsMap = {};
    this.dataDirectChangeAvailable = false;
    this.dataApprovedAvailable = false;
    this.dataDeclinedAvailable = false;
  }

  markNotificationAsRead(): void {
    if (this.isBSR) {
      if (this.dataDirectChangeAvailable)
        this.dataChangedNotificationService
          .read(
            this.viewState.businessSiteId,
            this.viewState.legalInformation.company.id,
            this.directChangeFields,
            'DIRECT_CHANGE'
          ).pipe(take(1))
          .subscribe();

      if (this.dataApprovedAvailable)
        this.dataChangedNotificationService
          .read(
            this.viewState.businessSiteId,
            this.viewState.legalInformation.company.id,
            this.approvedFields,
            'APPROVED'
          ).pipe(take(1))
          .subscribe();

      if (this.dataDeclinedAvailable)
        this.dataChangedNotificationService
          .read(
            this.viewState.businessSiteId,
            this.viewState.legalInformation.company.id,
            this.declinedFields,
            'DECLINED'
          ).pipe(take(1))
          .subscribe();
    }
  }

  contractStateAddButtonClicked(): void {
    this.actionService.dispatchAddContractStatusAction();
    this.viewState.legalInformationControl.markAsDirty();
  }

  contractStateRemoveButtonClicked(legalContract: LegalContract): void {
    this.actionService.dispatchRemoveContractStatusAction(legalContract.id);
    this.viewState.legalInformationControl.markAsDirty();
  }

  contractStateChanged(legalContract: LegalContract): void {
    this.actionService.dispatchUpdateContractStatusAction(legalContract);
  }

  evaluateTaskStatus(): void {
    if (this.viewState.businessSiteId) {
      combineLatest([
        this.businessSiteTaskService.existsOpenDataChangeFor(
          this.viewState.businessSiteId,
          this.dataClusters
        ),
        this.businessSiteTaskService.existsOpenDataChangeFor(
          this.viewState.businessSiteId,
          [],
          null,
          this.LEGAL_AGGREGATES
        ),
        this.businessSiteTaskService.existsOpenVerificationTaskFor(
          this.viewState.businessSiteId,
          this.dataClusters
        ),
        this.businessSiteTaskService.existsOpenVerificationTaskFor(
          this.viewState.businessSiteId,
          [],
          this.LEGAL_AGGREGATES
        )
      ])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          ([
             isDataChangeTaskPresentByDataCluster,
             isDataChangeTaskPresentByAggregate,
             isVerificationTaskPresentByDataCluster,
             isVerificationTaskPresentByAggregate
           ]) => {
            this.isTaskPresent =
              isDataChangeTaskPresentByDataCluster || isDataChangeTaskPresentByAggregate;
            this.isVerificationTaskPresent =
              isVerificationTaskPresentByDataCluster || isVerificationTaskPresentByAggregate;

            this.taskStatusEvaluated = true;
          }
        );
    }
  }

  legalInfoOnRemain(field: string) {
    if (this.verificationTasksStatusMap[field] !== VerificationTaskFormStatus.NOT_PRESENT && this.isBSR) {
      this.verificationTasksStatusMap[field] = VerificationTaskFormStatus.REMAIN;
    }
  }

  legalInfoOnChanged(field: string) {
    if (this.verificationTasksStatusMap[field] !== VerificationTaskFormStatus.NOT_PRESENT && this.isBSR) {
      this.verificationTasksStatusMap[field] = VerificationTaskFormStatus.CHANGED;
    }
  }

  private checkPermissionAndEvaluateTaskStatus(): void {
    combineLatest([
      this.businessSiteStoreService.getOutlet(),
      this.businessSiteStoreService.getDistributionLevels(),
      this.featureToggleService.isFocusFeatureEnabled(),
      this.featureToggleService.isFeatureEnabled('CONTRACT_STATUS_DOWNTIME')
    ])
      .pipe(
        tap(([outlet, distributionLevels, focusEnabled, contractStatusDowntimeEnabled]) => {
          this.outletCountryId = outlet.countryId;
          this.isOutletRetailer = distributionLevels.includes("RETAILER")
          this.focusEnabled = focusEnabled;
          this.contractStatusDowntimeEnabled = contractStatusDowntimeEnabled;
          this.isRO = this.viewState.registeredOffice
        }),
        switchMap(([outlet, distributionLevels]) =>
          this.legalInformationService.getPermissions(outlet, distributionLevels, this.focusEnabled)
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe((permissions: LegalInformationPermissions) => {
        this.editLegalInfoIsAllowed = permissions.editLegalInfoIsAllowed;
        this.authorizedForBusinessSite = permissions.restrictedToBusinessSite;
        this.contractBrandAllowedOptions = permissions.restrictedToBrands;
        this.contractCompanyRelationAllowedOptions = permissions.restrictedToCompanyRelation;
        this.authorizedForCountry = permissions.restrictedToCountry;
        this.authorizedForDistributionLevel = permissions.restrictedToDistributionLevel;
        this.retailVerifyData = permissions.retailVerifyData;
        this.isUserAuthorizedForVerificationTask = permissions.isUserAuthorizedToCreateVerificationTask;
        this.viewState.permissions = permissions;
        if (
          permissions.restrictedToBusinessSite &&
          permissions.restrictedToCountry &&
          !this.taskStatusEvaluated
        ) {
          this.evaluateTaskStatus();
        }
      });
  }
}
