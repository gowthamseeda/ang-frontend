import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { UserService } from '../../../../iam/user/user.service';
import { DataNotification } from '../../../../notifications/models/notifications.model';
import { DataChangedNotificationService } from '../../../../notifications/services/data-changed-notification.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { AGGREGATE_FIELDS } from '../../../../shared/model/constants';
import { GpsValidators } from '../../../../shared/validators/gps-validators';
import { TaskWebSocketService } from '../../../../tasks/service/task-websocket.service';
import { BusinessSiteTaskService } from '../../../../tasks/shared/business-site-task.service';
import { DataCluster, Task } from '../../../../tasks/task.model';
import { RETAILER_ROLE } from '../../../../tasks/tasks.constants';
import {
  additionalAddressFields,
  addressFields,
  baseDataAggregateFields,
  baseDataDataClusters,
  gpsFields,
  poBoxFields
} from '../../../legal-structure.constants';
import { BaseDataUtil } from '../../../shared/components/common/baseDataUtil';
import {
  ActiveLanguage,
  ActiveLanguageService
} from '../../../shared/components/language-toggle/active-language.service';
import { AffectedBusinessSites } from '../../../shared/components/status/status.component';
import { AddressType } from '../../../shared/models/address.model';
import { Outlet, OutletTranslation } from '../../../shared/models/outlet.model';
import { MessageService } from '../../../shared/services/message.service';
import { BaseData4rService } from '../../base-data-4r.service';

interface Translation {
  languageId: string;
  formGroup: UntypedFormGroup;
  formData: OutletTranslation;
}

@Component({
  selector: 'gp-outlet-form',
  templateUrl: './outlet-form.component.html',
  styleUrls: ['./outlet-form.component.scss']
})
export class OutletFormComponent implements OnInit, OnDestroy {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  outlet: Outlet;
  @Input()
  isTestOutlet: Boolean = false;
  @Input()
  dataChangeViewClicked = new EventEmitter<void>();
  @Output()
  isDataChanged = new EventEmitter<boolean>();
  @Input()
  isRetailOutlet: boolean = false;
  @Input()
  isMarketResponsible: boolean = false;
  @Input()
  isBusinessSiteResponsible: boolean = false;
  dataChangeCluster: string[] = [];
  index = 0;

  translationsParentForms: UntypedFormGroup;
  translations: Translation[] = [];
  activeTranslation: ActiveLanguage;
  affectedBusinessSites: Array<string> = [];
  rejectingBusinessSites: Array<string> = [];
  companyUpdateIsAllowed: Observable<boolean>;
  addressType: typeof AddressType = AddressType;
  messages: Observable<{ [key: string]: any } | void>;
  addressDataNotifications: DataNotification[] = [];
  additionalAddressDataNotifications: DataNotification[] = [];
  poBoxDataNotifications: DataNotification[] = [];
  gpsDataNotifications: DataNotification[] = [];
  is4RNotificationLoading = true;
  is4RVerificationLoading = true;
  allNotification: DataNotification[] = [];
  retailVerifyData: boolean;
  addressVerificationTasks: Task[] = [];
  additionalAddressVerificationTasks: Task[] = [];
  poBoxVerificationTasks: Task[] = [];
  gpsVerificationTasks: Task[] = [];
  isForRetailEnabled: boolean;
  isBlockVerificationsTasksRemained = of(false);

  readonly aggregateFields = [
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_STREET,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_NUMBER,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_ADDRESS_ADDITION,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_ZIP_CODE,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_CITY,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_DISTRICT,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_STATE,
    AGGREGATE_FIELDS.BASE_DATA_ADDRESS_PROVINCE,
    AGGREGATE_FIELDS.BASE_DATA_NAME_ADDITION,
    AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_STREET,
    AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_STREET_NUMBER,
    AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ADDRESS_ADDITION,
    AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ZIP_CODE,
    AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_CITY,
    AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_DISTRICT,
    AGGREGATE_FIELDS.BASE_DATA_PO_BOX_NUMBER,
    AGGREGATE_FIELDS.BASE_DATA_PO_BOX_ZIP_CODE,
    AGGREGATE_FIELDS.BASE_DATA_PO_BOX_CITY,
    AGGREGATE_FIELDS.BASE_DATA_GPS_LATITUDE,
    AGGREGATE_FIELDS.BASE_DATA_GPS_LONGITUDE
  ];

  readonly dataClusters = [
    DataCluster.BASE_DATA_ADDRESS_STREET,
    DataCluster.BASE_DATA_ADDRESS_NUMBER,
    DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION,
    DataCluster.BASE_DATA_ADDRESS_ZIP_CODE,
    DataCluster.BASE_DATA_ADDRESS_CITY,
    DataCluster.BASE_DATA_ADDRESS_DISTRICT,
    DataCluster.BASE_DATA_ADDRESS_STATE,
    DataCluster.BASE_DATA_ADDRESS_PROVINCE,
    DataCluster.BASE_DATA_ADDITIONAL_ADDRESS,
    DataCluster.BASE_DATA_PO_BOX,
    DataCluster.BASE_DATA_GPS
  ];
  poBoxAggregateFields = [
    'poBoxCity',
    'poBoxNumber',
    'poBoxZipCode'
  ]

  private unsubscribe = new Subject<void>();

  constructor(
    messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private activeLanguageService: ActiveLanguageService,
    private userAuthorizationService: UserAuthorizationService,
    private changeDetectorRef: ChangeDetectorRef,
    private businessSiteTaskService: BusinessSiteTaskService,
    private dataChangedNotificationService: DataChangedNotificationService,
    private featureToggleService: FeatureToggleService,
    private userService: UserService,
    private baseDataUtil: BaseDataUtil,
    private baseData4rService: BaseData4rService,
    private taskWebSocketService: TaskWebSocketService
  ) {
    this.messages = messageService.get();
  }

  ngOnInit(): void {
    this.initTranslationForm();
    this.subscribeToUserAuthorizations();
    this.subscribeToActiveLanguageChanges();
    this.changeDetectorRef.detectChanges();

    this.featureToggleService.isFeatureEnabled('FOR_RETAIL').subscribe(forRetailEnabled => {
      this.isForRetailEnabled = forRetailEnabled;
      if (forRetailEnabled) {
        this.retrieveNotifications();
        this.getRetailerPermission();
        this.evaluateVerificationTasks();
        this.baseData4rService.setEditPage(true);
        this.subscribeTasksChanges();
      } else {
        this.is4RNotificationLoading = false;
        this.is4RVerificationLoading = false;
      }
    });
    if (this.dataChangeViewClicked) {
      this.dataChangeViewClicked.subscribe(() => {
        this.scrollToDataChangedElement();
      });
    }

    setTimeout(() => {
      this.is4RNotificationLoading = false;
      this.is4RVerificationLoading = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.dataChangeViewClicked.unsubscribe();
    this.baseData4rService.resetServices();
  }

  addressStreetDataRequired(): boolean {
    const gpsGroup = this.parentForm.get('gps');
    if (!gpsGroup) {
      return true;
    }
    return (
      GpsValidators.longitudeEmpty(gpsGroup.value) && GpsValidators.latitudeEmpty(gpsGroup.value)
    );
  }

  setAffectedBusinessSites(values: AffectedBusinessSites): void {
    this.affectedBusinessSites = values.businessSitesRequestStartOperationDateChange;
    this.rejectingBusinessSites = values.businessSitesPreventCompanyToChangeStartOperationDate;
  }

  private subscribeToUserAuthorizations(): void {
    this.companyUpdateIsAllowed = this.userAuthorizationService.isAuthorizedFor
      .permissions([
        this.isTestOutlet ? 'legalstructure.testoutlet.update' : 'legalstructure.company.update'
      ])
      .verify();
  }

  private initTranslationForm(): void {
    this.translationsParentForms = this.formBuilder.group({});
    if (this.parentForm.disabled) {
      this.translationsParentForms.disable();
    }
    this.parentForm.addControl('additionalTranslations', this.translationsParentForms);

    if (this.outlet.additionalTranslations) {
      this.translations = Object.entries(this.outlet.additionalTranslations).map(
        (additionalTranslationEntry: [string, OutletTranslation]) => {
          const additionalTranslationEntryForm = this.formBuilder.group({});
          if (this.translationsParentForms.disabled) {
            additionalTranslationEntryForm.disable();
          }
          this.translationsParentForms.addControl(
            additionalTranslationEntry[0],
            additionalTranslationEntryForm
          );
          return {
            languageId: additionalTranslationEntry[0],
            formGroup: additionalTranslationEntryForm,
            formData: additionalTranslationEntry[1]
          };
        }
      );
    }
  }

  private subscribeToActiveLanguageChanges(): void {
    this.activeLanguageService
      .get()
      .pipe(
        filter(activeLanguage => activeLanguage !== undefined),
        takeUntil(this.unsubscribe)
      )
      .subscribe(activeLanguage => {
        this.activeTranslation = activeLanguage;
        if (
          activeLanguage.languageId &&
          !activeLanguage.isDefaultLanguage &&
          this.translations.find(
            translation => translation.languageId === activeLanguage.languageId
          ) === undefined
        ) {
          const translationFormForActiveLanguage = this.formBuilder.group({});
          if (this.translationsParentForms.disabled) {
            translationFormForActiveLanguage.disable();
          }
          this.translationsParentForms.addControl(
            activeLanguage.languageId,
            translationFormForActiveLanguage
          );
          this.translations.push({
            languageId: activeLanguage.languageId,
            formGroup: translationFormForActiveLanguage,
            formData: {}
          });
        }
      });
  }

  private retrieveNotifications(): void {
    this.userService
      .getRoles()
      .pipe(take(1))
      .subscribe(roles => {
        if (roles.some(role => RETAILER_ROLE.includes(role))) {
          this.dataChangedNotificationService
            .get(this.outlet.id, this.outlet.companyId)
            .pipe(take(1))
            .subscribe(notifications => {
              if (notifications.length > 0) {
                notifications.forEach(notification => {
                  if (addressFields.includes(notification.changedField)) {
                    this.addressDataNotifications = [
                      ...this.addressDataNotifications,
                      notification
                    ];
                    this.allNotification.push(notification);
                    this.addChangeFieldToDataChangeCluster('address');
                  } else if (additionalAddressFields.includes(notification.changedField)) {
                    this.additionalAddressDataNotifications = [
                      ...this.additionalAddressDataNotifications,
                      notification
                    ];
                    this.allNotification.push(notification);
                    this.addChangeFieldToDataChangeCluster('additional-address');
                  } else if (poBoxFields.includes(notification.changedField)) {
                    this.poBoxDataNotifications = [...this.poBoxDataNotifications, notification];
                    this.allNotification.push(notification);
                    this.addChangeFieldToDataChangeCluster('poBox');
                  } else if (gpsFields.includes(notification.changedField)) {
                    this.gpsDataNotifications = [...this.gpsDataNotifications, notification];
                    this.allNotification.push(notification);
                    this.addChangeFieldToDataChangeCluster('gps');
                  }
                });
              }
              this.is4RNotificationLoading = false;

              if (this.allNotification.length > 0) {
                let dataNotificationChangeFields =
                  this.baseDataUtil.getDataNotificationChangeFields(this.allNotification);

                if (dataNotificationChangeFields.directChange.length > 0) {
                  this.dataChangedNotificationService
                    .read(
                      this.outlet.id,
                      this.outlet.companyId,
                      dataNotificationChangeFields.directChange,
                      'DIRECT_CHANGE'
                    )
                    .pipe(take(1))
                    .subscribe();

                  this.isDataChanged.emit(true);
                }

                this.dataChangedNotificationService
                  .read(
                    this.outlet.id,
                    this.outlet.companyId,
                    dataNotificationChangeFields.approved,
                    'APPROVED'
                  )
                  .pipe(take(1))
                  .subscribe();

                this.dataChangedNotificationService
                  .read(
                    this.outlet.id,
                    this.outlet.companyId,
                    dataNotificationChangeFields.declined.map(field => field.field),
                    'DECLINED'
                  )
                  .pipe(take(1))
                  .subscribe();
              }
            });
        } else {
          this.is4RNotificationLoading = false;
        }
      });
  }

  private scrollToDataChangedElement() {
    let dataChangeClusterSize = this.dataChangeCluster.length;
    if (dataChangeClusterSize > 0) {
      setTimeout(() => {
        const element = document.getElementById(this.dataChangeCluster[this.index]);
        if (element) {
          element.scrollIntoView();
        }
      }, 250);

      this.index++;
      if (this.index == dataChangeClusterSize) {
        this.index = 0;
      }
    }
  }

  private addChangeFieldToDataChangeCluster(changeField: string) {
    if (!this.dataChangeCluster.includes(changeField)) {
      this.dataChangeCluster.push(changeField);
    }
  }

  private getRetailerPermission(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(['app.retail.show'])
      .verify()
      .subscribe(isRetailer => {
        this.retailVerifyData = isRetailer;
      });
  }

  private evaluateVerificationTasks() {
    this.businessSiteTaskService.getByOutletId(this.outlet.id).subscribe(tasks => {
      const filteredTasks = tasks.filter(task => task.type === 'DATA_VERIFICATION');
      this.baseData4rService.setAllVerificationTasks(filteredTasks);
      if (filteredTasks.length > 0) {
        filteredTasks.forEach(task => {
          if (
            this.isAddressDataCluster(task.dataCluster) ||
            this.isAddressAggregateField(task.aggregateField)
          ) {
            this.addressVerificationTasks.push(task);
          } else if (
            task.dataCluster === DataCluster.BASE_DATA_ADDITIONAL_ADDRESS ||
            task.aggregateField?.startsWith('additionalAddress')
          ) {
            this.additionalAddressVerificationTasks.push(task);
          } else if (
            task.dataCluster === DataCluster.BASE_DATA_PO_BOX ||
            task.aggregateField?.startsWith('poBox')
          ) {
            this.poBoxVerificationTasks.push(task);
          } else if (
            task.dataCluster === DataCluster.BASE_DATA_GPS ||
            task.aggregateField?.startsWith('gps')
          ) {
            this.gpsVerificationTasks.push(task);
          }
        });
        this.baseData4rService.setAddressVerificationTasks(this.addressVerificationTasks);
        this.baseData4rService.setAdditionalAddressVerificationTasks(
          this.additionalAddressVerificationTasks
        );
        this.baseData4rService.setPoBoxVerificationTasks(this.poBoxVerificationTasks);
        this.baseData4rService.setGpsVerificationTasks(this.gpsVerificationTasks);
        this.is4RVerificationLoading = false
      } else {
        this.is4RVerificationLoading = false
      }
    });
  }

  private isAddressDataCluster(dataCluster: DataCluster | undefined): boolean {
    return dataCluster
      ? (dataCluster.toString().startsWith('BASE_DATA_ADDRESS_') ||
        dataCluster === DataCluster.BASE_DATA_NAME_ADDITION) &&
      this.dataClusters.includes(dataCluster)
      : false;
  }

  private isAddressAggregateField(aggregateField: string | undefined): boolean {
    return aggregateField
      ? (aggregateField.startsWith('address') ||
        aggregateField === 'nameAddition' ||
        aggregateField === 'state' ||
        aggregateField === 'province') &&
      this.aggregateFields.includes(aggregateField)
      : false;
  }

  private subscribeTasksChanges(): void {
    this.taskWebSocketService
      .getLiveTask()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(
          data =>
            data.businessSiteId === this.outlet.id &&
            ((data.aggregateField != undefined &&
              baseDataAggregateFields.includes(data.aggregateField)) ||
              (data.dataCluster != undefined && baseDataDataClusters.includes(data.dataCluster)))
        )
      )
      .subscribe(_data => {
        this.evaluateVerificationTasks();
        this.retrieveNotifications();
      });
  }
}
