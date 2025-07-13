import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { DateAdapter } from '@angular/material/core';
import _ from 'lodash';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import { PopupComponent } from '../../../shared/components/popup/popup.component';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { LocaleService } from '../../../shared/services/locale/locale.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import {
  AggregateField,
  DataCluster,
  DataVerificationField,
  Status,
  Task,
  TaskRequest,
  Type
} from '../../../tasks/task.model';
import { BusinessSiteStoreService } from '../../businessSite/services/business-site-store.service';
import { Outlet } from '../../shared/models/outlet.model';
import { OfferedServiceDataService } from '../../../services/offered-service/store/offered-service-data.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { TaskDataService } from '../../../tasks/task/store/task-data.service';

@Component({
  selector: 'gp-verification-request',
  templateUrl: './verification-request.component.html',
  styleUrls: ['./verification-request.component.scss']
})
export class VerificationRequestComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output()
  isInitialized = new EventEmitter();
  @Output()
  isClosed = new EventEmitter();
  @ViewChild(PopupComponent)
  public popupComponent: PopupComponent;

  form: UntypedFormGroup;
  maxCommentCharLength = 280;
  dueDate: Date;
  currentDate = new Date();

  dataCluster = Object.values(DataCluster);
  legalDataCluster: DataCluster[];
  baseDataDataCluster: { isExpanded: boolean; name: string }[];
  serviceDataCluster = Object.values(DataCluster).filter(
    dc => dc === 'COMMUNICATION_CHANNELS' || dc === 'OPENING_HOURS'
  );
  tasks: Array<Task>;
  checkStatus: Array<boolean> = new Array<boolean>();
  outlet: Outlet;
  disabled = true;
  isRegisteredOffice = false;
  forRetailFeatureToggleFlag: Observable<boolean>;
  dataVerificationFields: DataVerificationField[];
  private unsubscribe = new Subject<void>();
  currentSelectedLanguage?: string;
  servicesData: Map<String, number> = new Map();
  services: String[] = []
  openingHour4RTaskToBeCreated: number[] = []

  constructor(
    private businessSiteStoreService: BusinessSiteStoreService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private dateAdapter: DateAdapter<any>,
    private localeService: LocaleService,
    private snackBarService: SnackBarService,
    private featureToggleService: FeatureToggleService,
    private offeredServiceDataService: OfferedServiceDataService,
    private userSettingsService: UserSettingsService,
    private taskDataService: TaskDataService
  ) {}

  ngOnInit(): void {
    this.initLanguage();
    this.localeService
      .currentBrowserLocale()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locale => {
        this.dateAdapter.setLocale(locale);
      });
    this.getForRetailFeatureToggle();
    this.initForm();
    this.initBaseDataDataCluster();
    this.fetchDataVerificationFields();
    this.initLegalDataCluster();
    this.initVerifiableService();
  }

  initLanguage() {
    this.userSettingsService
      .getLanguageId()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languageId => (this.currentSelectedLanguage = languageId));
  }

  initBaseDataDataCluster() {
    this.forRetailFeatureToggleFlag.subscribe(forRetailEnabled => {
      this.baseDataDataCluster = Object.values(DataCluster)
        .filter(
          dc =>
            (dc.startsWith('BASE_DATA') &&
              !dc.startsWith('BASE_DATA_ADDRESS_') &&
              (dc != DataCluster.BASE_DATA_STATE_AND_PROVINCE || !forRetailEnabled)) ||
            dc === 'BUSINESS_NAME' ||
            dc === 'GENERAL_COMMUNICATION_CHANNELS'
        )
        .map(item => ({
          name: item,
          isExpanded: false
        }));
    });
  }

  initVerifiableService() {
    this.offeredServiceDataService
      .getVerifiableServices(this.outlet.id)
      .pipe(take(1))
      .subscribe(response => {
          response.forEach(service => {
            const matchingTranslation = service.translations?.find(
              translation => translation.languageId == this.currentSelectedLanguage
            );
            const key = matchingTranslation ? matchingTranslation.name : service.name;
            this.servicesData.set(key, service.serviceId);
            this.services.push(key);
          });
        }
      );
  }

  addOpeningHour4RTask(service: String, checked: boolean): void {
    const serviceId = this.servicesData.get(service)
    if(serviceId != undefined) {
      if (checked) {
        this.openingHour4RTaskToBeCreated.push(serviceId)
      } else {
        this.openingHour4RTaskToBeCreated = this.openingHour4RTaskToBeCreated.filter(service => service != serviceId)
      }
    }
    this.disabled = this.checkStatus.filter(checked => checked).length === 0 &&
      this.openingHour4RTaskToBeCreated.length === 0
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.isInitialized.emit();
  }

  openDialog(): void {
    if (!this.popupComponent.isOpened) {
      this.popupComponent.openDialog();
    }
  }

  save(): void {
    let created = 0;
    let taskToBeCreated = this.getCheckedCluster()
      ?.map(dataCluster => this.createTaskRequest(dataCluster, this.outlet.id))
      .concat(
        this.getCheckedDataVerificationFields()?.map(verificationField => {
          let aggregateName = this.getAggregateName(verificationField.name);
          let aggregateField = this.removeUnderscores(verificationField.name);
          return this.createTaskRequestByDataVerificationFields(
            this.outlet.id,
            aggregateName,
            aggregateField
          );
        })
      );

    taskToBeCreated.forEach(taskRequest=>{
      this.businessSiteTaskService
        .createTask(taskRequest)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (objectStatus: ObjectStatus) => {
            if (objectStatus.status === 'CREATED') {
              created++;
              if (taskToBeCreated.length === created) {
                this.snackBarService.showInfo('DATA_VERIFICATION_SNACK_BAR');
                this.isClosed.emit();
              }
              return;
            }
          },
          error: (error) => {
            this.snackBarService.showError(error);
          }
        })
    })

    if(this.openingHour4RTaskToBeCreated.length != 0) {
      const dueDate = this.form.controls['dueDate'].value;

      this.taskDataService.createOpeningHoursVerificationTaskByServiceId(
        this.outlet.id,
        this.openingHour4RTaskToBeCreated,
        this.form.controls['textArea'].value ?? '',
        dueDate !== null ? moment(dueDate).toDate().toISOString() : ''
      ).pipe(take(1))
        .subscribe({
          next: () => {
                this.snackBarService.showInfo('DATA_VERIFICATION_SNACK_BAR');
                this.isClosed.emit();
          },
          error: (error) => {
            this.snackBarService.showError(error);
          }
        })
    }
  }

  cancel(): void {
    this.isClosed.emit();
  }

  initForm(): void {
    this.form = new UntypedFormGroup({
      dueDate: new UntypedFormControl(this.dueDate),
      textArea: new UntypedFormControl('', Validators.maxLength(this.maxCommentCharLength))
    });
    this.dataCluster.forEach(dataCluster => {
      this.form.addControl(dataCluster, new UntypedFormControl());
    });

    this.businessSiteStoreService
      .getOutlet()
      .pipe(
        switchMap((outlet: Outlet) => {
          this.outlet = outlet;
          this.isRegisteredOffice = outlet.registeredOffice ?? false;
          return this.businessSiteTaskService.getBy(outlet.id);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe();
    this.disableCheckboxIfIsNonRegisteredOffice(this.isRegisteredOffice);
    this.disableOkButtonIfNoCheckBoxIsChecked();
  }

  private createTaskRequest(dataCluster: string, businessSiteId: string): TaskRequest {
    const dueDate = this.form.controls['dueDate'].value;
    return {
      businessSiteId: businessSiteId,
      comment: this.form.controls['textArea'].value ?? '',
      dueDate: dueDate !== null ? moment(dueDate).toDate().toISOString() : '',
      dataCluster: dataCluster,
      status: Status.OPEN,
      type: Type.DATA_VERIFICATION
    };
  }

  private createTaskRequestByDataVerificationFields(
    businessSiteId: string,
    aggregateName: string,
    aggregateField: string
  ): TaskRequest {
    const dueDate = this.form.controls['dueDate'].value;
    return {
      businessSiteId: businessSiteId,
      comment: this.form.controls['textArea'].value ?? '',
      dueDate: dueDate !== null ? moment(dueDate).toDate().toISOString() : '',
      aggregateName: aggregateName,
      aggregateField: aggregateField,
      status: Status.OPEN,
      type: Type.DATA_VERIFICATION
    };
  }

  //enable it back when needed
  /*  private disableCheckboxes(tasks: Task[]): void {
      this.dataCluster.forEach(dataCluster => {
        const relTasks = tasks.filter(
          task =>
            task.dataCluster === dataCluster &&
            task.type === Type.DATA_VERIFICATION &&
            task.status === Status.OPEN
        );
        relTasks.forEach((task: Task) => {
          const control = this.form.controls[task.dataCluster];
          control.patchValue({ checked: true });
          control.disable();
        });
      });
    }*/

  private disableOkButtonIfNoCheckBoxIsChecked(): void {
    this.form.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      let fields = this.getAggregateFields();
      fields
        .concat(this.dataCluster)
        .filter(dataCluster => this.form.contains(dataCluster))
        .forEach(dataCluster => {
          this.checkStatus.push(this.form.get(dataCluster)?.value);
        });
      this.disabled = this.checkStatus.filter(checked => checked).length === 0 &&
        this.openingHour4RTaskToBeCreated.length === 0
      this.checkStatus = new Array<boolean>();
    });
  }

  private disableCheckboxIfIsNonRegisteredOffice(isRegisteredOffice: boolean): void {
    if (!isRegisteredOffice) {
      this.form.get(DataCluster.LEGAL_VAT_NO)?.disable();
      this.form.get(DataCluster.LEGAL_LEGAL_FOOTER)?.disable();
    }
  }

  getForRetailFeatureToggle(): void {
    this.forRetailFeatureToggleFlag = this.featureToggleService
      .isFeatureEnabled('FOR_RETAIL')
      .pipe(takeUntil(this.unsubscribe));
  }

  getSubCluster(clusterName: string): string[] {
    return Object.values(DataCluster).filter(dc => dc.startsWith(clusterName + '_'));
  }

  getSubAggregateField(aggregateFieldName: string): string[] {
    return this.getAggregateFieldsFromAggregateFieldObject().find(
      aggregateField => aggregateField.name == aggregateFieldName
    )!.subFields;
  }

  getDataCluster(clusterName: string): DataCluster {
    return DataCluster[clusterName];
  }

  getCheckedCluster(): DataCluster[] {
    let result = this.dataCluster.filter(
      dataCluster => this.form.contains(dataCluster) && this.form.get(dataCluster)?.value
    );
    return [...new Set(result)];
  }

  checkAllChildCluster(mainAggregateFieldName: string): void {
    if (this.form.get(mainAggregateFieldName)?.value) {
      this.getSubAggregateField(mainAggregateFieldName).forEach(subAggregateFieldName => {
        const control = this.form.controls[subAggregateFieldName];
        control.patchValue({ checked: true });
      });
    } else {
      this.getSubAggregateField(mainAggregateFieldName).forEach(subAggregateFieldName => {
        const control = this.form.controls[subAggregateFieldName];
        control.setValue(false);
      });

      this.disableOkButtonIfNoCheckBoxIsChecked();
    }
    this.form.markAsDirty();
  }

  checkChildCheckBox(mainAggregateFieldName: string): void {
    this.setMainAggregateFieldControl(
      mainAggregateFieldName,
      this.isAllSubAggregateFieldChecked(mainAggregateFieldName)
    );
    this.form.markAsDirty();
  }

  setMainAggregateFieldControl(mainAggregateField: string, value: boolean) {
    this.form.controls[mainAggregateField].setValue(value);
  }

  isAllSubAggregateFieldChecked(mainAggregateFieldName: string): boolean {
    return this.getSubAggregateField(mainAggregateFieldName).every(subAggregateFieldName => {
      return this.form.get(subAggregateFieldName)?.value;
    });
  }

  toUpperSnakeCase(str: string) {
    return _.snakeCase(str).toUpperCase();
  }

  toPascalCase(str: string | undefined): string {
    return _.upperFirst(_.camelCase(str));
  }

  removeUnderscores(str: string): string {
    return str.replace(/_./g, (match) => match.charAt(1).toUpperCase());
  }

  fetchDataVerificationFields() {
    this.forRetailFeatureToggleFlag.subscribe(forRetailEnabled => {
      if (forRetailEnabled) {
        this.businessSiteTaskService
          .findAllDataVerificationFields()
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(dataVerificationFields => {
            this.dataVerificationFields = dataVerificationFields.dataVerificationFields
              .map(field => {
                field.aggregateName = this.toUpperSnakeCase(field.aggregateName);

                field.aggregateFieldObjs = field.aggregateFields.map(field => {
                  const isSubField = field.includes('_');
                  return new AggregateField(field, false, false, isSubField);
                });

                this.addControlAndAggregateFieldIfIsObject(field);

                field.aggregateFields.forEach(dataCluster => {
                  this.form.addControl(dataCluster, new UntypedFormControl());
                });

                return field;
              })
              .filter(field => {
                if (!this.isRegisteredOffice) {
                  return field.aggregateName !== 'COMPANY_LEGAL_INFO';
                } else return true;
              });

            this.dataVerificationFields.forEach(function (item, i) {
              if (item.aggregateName === 'BUSINESS_SITE') {
                this.dataVerificationFields.splice(i, 1);
                this.dataVerificationFields.unshift(item);
              }
            }, this);
          });
      } else {
        this.dataVerificationFields = [];
      }
    });
  }

  getAggregateFields() {
    return _.flatMap(this.dataVerificationFields, field => field.aggregateFields);
  }

  getAggregateFieldsFromAggregateFieldObject() {
    return _.flatMap(this.dataVerificationFields, field => field.aggregateFieldObjs);
  }

  addControlAndAggregateFieldIfIsObject(dataVerificationField: DataVerificationField) {
    let objectNames = this.getUniqueObjectNameFromAggregateFields(
      dataVerificationField.aggregateFields
    );
    objectNames.forEach(objectName => {
      dataVerificationField.aggregateFields.push(objectName);
      dataVerificationField.aggregateFieldObjs.push(
        new AggregateField(
          objectName,
          false,
          true,
          false,
          dataVerificationField.aggregateFields.filter(field => field.includes(objectName + '_'))
        )
      );
    });
  }

  getUniqueObjectNameFromAggregateFields(aggregateFields: string[]) {
    let objectNames = aggregateFields
      .filter(field => {
        return field.includes('_');
      })
      .map(field => {
        return field.split('_')[0];
      });
    return new Set(objectNames);
  }

  private initLegalDataCluster() {
    this.forRetailFeatureToggleFlag.subscribe(forRetailEnabled => {
      if (forRetailEnabled) {
        this.legalDataCluster = [];
        Object.values(DataCluster)
          .filter(dc => dc.startsWith('LEGAL'))
          .forEach(dc => {
            this.form.removeControl(dc);
          });
      } else {
        this.legalDataCluster = Object.values(DataCluster).filter(dc => dc.startsWith('LEGAL'));
      }
    });
  }

  private getCheckedDataVerificationFields() {
    return this.getAggregateFieldsFromAggregateFieldObject().filter(
      aggregateField => this.form.get(aggregateField.name)?.value && !aggregateField.isObject
    );
  }

  getAggregateName(verificationField: string) {
    return this.toPascalCase(
      this.dataVerificationFields.find(field => field.aggregateFields.includes(verificationField))
        ?.aggregateName
    );
  }
}
