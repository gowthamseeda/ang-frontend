import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BusinessSiteStoreService} from '../../../legal-structure/businessSite/services/business-site-store.service';
import {SnackBarService} from '../../../shared/services/snack-bar/snack-bar.service';
import {AggregateDataField, Status, TaskRequest, Type} from '../../task.model';
import {BusinessSiteTaskService} from '../business-site-task.service';
import {
  DataFieldVerificationDialogComponent
} from '../data-field-verification-dialog/data-field-verification-dialog.component';
import {map, switchMap, take} from "rxjs/operators";
import {BaseData4rService} from "../../../legal-structure/outlet/base-data-4r.service";
import {combineLatest, of} from "rxjs";
import {Service} from '../../../opening-hours/store/reducers/index';

@Component({
  selector: 'gp-data-field-verification-button',
  templateUrl: './data-field-verification-button.component.html',
  styleUrls: ['./data-field-verification-button.component.scss']
})
export class DataFieldVerificationButtonComponent {
  @Input()
  fields: AggregateDataField[] = [];
  @Input()
  service: Service;
  @Input()
  shouldShowDialog = false;
  @Input()
  fieldsStartName: string;
  @Input()
  specificFields: string[] = [];
  isVerificationLoading: boolean = false;
  isAllVerificationTasksAvailable = of(false);

  constructor(
    private matDialog: MatDialog,
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService,
    private businessSiteStoreService: BusinessSiteStoreService,
    private baseData4rService: BaseData4rService
  ) {
  }

  ngOnInit(): void {
    this.initiateVerificationField();
  }

  onTriggerVerification() {
    if (this.isVerificationLoading)
      return

    this.isVerificationLoading = true

    if (this.shouldShowDialog) {
      this.matDialog.open<DataFieldVerificationDialogComponent, { fields: AggregateDataField[], service: Service }>(
        DataFieldVerificationDialogComponent,
        {
          data: {
            fields: this.fields,
            service: this.service
          }
        }
      );
      this.isVerificationLoading = false
    } else {
      this.businessSiteStoreService
        .getOutlet()
        .pipe(take(1))
        .subscribe({
          next: outlet => {
            this.fields.forEach(field => {
              let task: TaskRequest = {
                businessSiteId: outlet.id,
                status: Status.OPEN,
                type: Type.DATA_VERIFICATION,
                comment: '',
                dueDate: '',
                // ONLY 4R has this in-place verification feature
                aggregateField: field.aggregateField,
                aggregateName: field.aggregateName
              };

              this.businessSiteTaskService
                .createTask(task)
                .pipe(take(1))
                .subscribe({
                  next: () => {
                    this.snackBarService.showInfo('DATA_VERIFICATION_SNACK_BAR');
                  },
                  error: error => {
                    this.snackBarService.showError(error);
                  },
                  complete: () => {
                    this.isVerificationLoading = false
                  }
                });
            });
          },
          error: () => {
            this.isVerificationLoading = false
          }
        });
    }
  }

  initiateVerificationField() {
    if (this.fields.length === 0) {
      this.businessSiteTaskService.findAllDataVerificationFields()
        .pipe(
          take(1),
          switchMap(dataVerificationFields => {
            const fieldsToCheck: AggregateDataField[] = [];
            dataVerificationFields.dataVerificationFields.forEach(field => {
              field.aggregateFields.forEach(aggField => {
                if (aggField.startsWith(this.fieldsStartName) || this.specificFields.includes(aggField)) {
                  fieldsToCheck.push({
                    aggregateName: field.aggregateName,
                    aggregateField: aggField
                  });
                }
              });
            });
            this.fields = fieldsToCheck;
            return combineLatest(
              fieldsToCheck.map(aggField =>
                this.baseData4rService.isOpenVerificationTaskByAggregateField(aggField.aggregateField!).pipe(
                  map(isOpen => ({ aggField, isOpen }))
                )
              )
            );
          })
        )
        .subscribe(results => {
          const openFields = results.filter(result => result.isOpen).map(result => result.aggField);
          this.fields = this.fields.filter(field => !openFields.includes(field));
          this.isAllVerificationTasksAvailable = of(this.fields.length === 0);
        });
    }
  }
}
