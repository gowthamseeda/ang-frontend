import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

import { CompModule } from '../../shared/components/components.module';
import { ServicesModule } from '../../shared/services/services.module';

import { DirectivesModule } from '../../shared/directives/directives.module';
import { MaterialModule } from '../../shared/material/material.module';
import { BusinessSiteTaskService } from './business-site-task.service';
import { CommentsDialogComponent } from './comments-dialog/comments-dialog.component';
import { DataChangedNotificationComponent } from './data-changed-notification/data-changed-notification.component';
import { DataFieldVerificationButtonComponent } from './data-field-verification-button/data-field-verification-button.component';
import { DataFieldVerificationDialogComponent } from './data-field-verification-dialog/data-field-verification-dialog.component';
import { DataFieldVerificationRemainButtonComponent } from './data-field-verification-remain-button/data-field-verification-remain-button.component';
import { InplaceTaskActionButtonComponent } from './inplace-task-action-button/inplace-task-action-button.component';
import { ReadOnlyNotificationComponent } from './read-only-notification/read-only-notification.component';
import { ReviewChangesMadeNotificationComponent } from './review-changes-made-notification/review-changes-made-notification/review-changes-made-notification.component';
import { TaskExpandableTableComponent } from './task-expandable-table/task-expandable-table.component';
import { TaskConfirmDialogComponent } from './task-footer/task-confirm-dialog/task-confirm-dialog.component';
import { TaskFooterComponent } from './task-footer/task-footer.component';
import { VerifyDataNotificationComponent } from './verify-data-notification/verify-data-notification.component';
import { OpeningHourTaskActionButtonComponent } from './opening-hour-task-action-button/opening-hour-task-action-button.component';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule,
    TranslateModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CompModule,
    MatFormFieldModule,
    MatDatepickerModule,
    DirectivesModule
  ],
  providers: [BusinessSiteTaskService],
  declarations: [
    TaskFooterComponent,
    TaskConfirmDialogComponent,
    ReadOnlyNotificationComponent,
    TaskExpandableTableComponent,
    VerifyDataNotificationComponent,
    DataChangedNotificationComponent,
    ReviewChangesMadeNotificationComponent,
    InplaceTaskActionButtonComponent,
    CommentsDialogComponent,
    DataFieldVerificationButtonComponent,
    DataFieldVerificationDialogComponent,
    DataFieldVerificationRemainButtonComponent,
    OpeningHourTaskActionButtonComponent
  ],
  exports: [
    TaskFooterComponent,
    ReadOnlyNotificationComponent,
    TaskExpandableTableComponent,
    VerifyDataNotificationComponent,
    DataChangedNotificationComponent,
    ReviewChangesMadeNotificationComponent,
    InplaceTaskActionButtonComponent,
    CommentsDialogComponent,
    DataFieldVerificationButtonComponent,
    DataFieldVerificationRemainButtonComponent,
    OpeningHourTaskActionButtonComponent,
  ]
})
export class TasksSharedModule { }
