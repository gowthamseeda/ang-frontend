import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Outlet } from 'app/legal-structure/shared/models/outlet.model';
import moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { BusinessSiteStoreService } from '../../../legal-structure/businessSite/services/business-site-store.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { AggregateDataField, Status, TaskRequest, Type } from '../../task.model';
import { BusinessSiteTaskService } from '../business-site-task.service';
import { take, takeUntil } from "rxjs/operators";
import { OfferedServiceDataService } from '../../../services/offered-service/store/offered-service-data.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { TaskDataService } from '../../../tasks/task/store/task-data.service';
import {Service} from '../../../opening-hours/store/reducers';


@Component({
  selector: 'gp-data-field-verification-dialog',
  templateUrl: './data-field-verification-dialog.component.html',
  styleUrls: ['./data-field-verification-dialog.component.scss']
})
export class DataFieldVerificationDialogComponent implements OnInit {
  form: UntypedFormGroup;
  maxCommentCharLength = 280;
  currentDate = new Date();
  outlet: Outlet;
  isForRetailEnabled: boolean;
  openingHour4RTaskToBeCreated: number[] = []
  servicesData: Map<String, number> = new Map();
  currentSelectedLanguage?: string;
  services: String[] = []
  private unsubscribe = new Subject<void>();
  

  constructor(
    private fb: UntypedFormBuilder,
    private matDialogRef: MatDialogRef<DataFieldVerificationDialogComponent>,
    private businessSiteStoreService: BusinessSiteStoreService,
    @Inject(MAT_DIALOG_DATA) public data: { fields: AggregateDataField[], service: Service },
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService,
    private featureToggleService: FeatureToggleService,
    private offeredServiceDataService: OfferedServiceDataService,
    private userSettingsService: UserSettingsService,
    private taskDataService: TaskDataService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      dueDate: new UntypedFormControl(),
      comment: new UntypedFormControl('', Validators.maxLength(this.maxCommentCharLength))
    });
    this.getCurrentBusinessSite();
    this.initForRetailFeature();
    this.initVerifiableService();
    this.initLanguage();
    
  }

  addOpeningHour4RTask(service: String): void { 
    const serviceId = this.servicesData.get(service)
    if(serviceId != undefined) {
        this.openingHour4RTaskToBeCreated.push(serviceId)
    }
  }

  initLanguage() {
      this.userSettingsService
        .getLanguageId()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(languageId => (this.currentSelectedLanguage = languageId));
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

  onSubmit() { 
    
    
    const dueDate = this.form.controls['dueDate'].value;
    if(this.data.fields[0].dataCluster === 'OPENING_HOURS' && this.data.service) {
     
      this.addOpeningHour4RTask(this.data.service.serviceName)
    }

    const taskObservables = this.data.fields.map(field => {
      if(this.openingHour4RTaskToBeCreated.length != 0) {
        this.taskDataService.createOpeningHoursVerificationTaskByServiceId(
          this.outlet.id,
          this.openingHour4RTaskToBeCreated,
          this.form.controls['textArea'].value ?? '',
          dueDate !== null ? moment(dueDate).toDate().toISOString() : ''
        ).pipe(take(1))
          .subscribe({
            next: () => {
                  this.snackBarService.showInfo('DATA_VERIFICATION_SNACK_BAR');
            },
            error: (error) => {
              this.snackBarService.showError(error);
            }
          })
      } else {
        let taskData: TaskRequest = {
          businessSiteId: this.outlet.id,
          status: Status.OPEN,
          type: Type.DATA_VERIFICATION,
          comment: this.form.controls['comment'].value,
          dueDate: dueDate !== null ? moment(dueDate).toDate().toISOString() : ''
        };

      if (this.isForRetailEnabled) {
        taskData.aggregateField = field.aggregateField;
        taskData.aggregateName = field.aggregateName;
        taskData.dataCluster = field.dataCluster
      } else {
        taskData.dataCluster = field.dataCluster;
      }

      return this.businessSiteTaskService.createTask(taskData).pipe(take(1));
      }
    });

    forkJoin(taskObservables).subscribe({
      next: () => {
        this.snackBarService.showInfo('DATA_VERIFICATION_SNACK_BAR');
        this.closeDialog();
      },
      error: (error) => {
        this.snackBarService.showError(error);
      }
    });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  private getCurrentBusinessSite() {
    this.businessSiteStoreService
      .getOutlet()
      .pipe(take(1))
      .subscribe((outlet: Outlet) => {
        this.outlet = outlet;
      });
  }

  private initForRetailFeature() {
    this.featureToggleService
      .isFeatureEnabled('FOR_RETAIL')
      .pipe(take(1))
      .subscribe(featureEnabled => (this.isForRetailEnabled = featureEnabled));
  }
}
