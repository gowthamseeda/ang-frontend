import { NgModule } from '@angular/core';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SharedModule } from '../shared/shared.module';

import { ApiSchedulerComponent } from './container/api-scheduler/api-scheduler.component';
import { EditXmlSchedulerComponent } from './container/edit-xml-scheduler/edit-xml-scheduler.component';
import { SchedulerComponent } from './container/scheduler/scheduler.component';
import { AuditLogCleanSchedulerTableComponent } from './presentational/audit-log-clean-scheduler-table/audit-log-clean-scheduler-table.component';
import { UserTaskCleanSchedulerStatusComponent } from "./presentational/user-tasks-clean-scheduler-status/user-task-clean-scheduler-status.component";
import { JobIdReadOnlyComponent } from './presentational/job-id-read-only/job-id-read-only.component';
import { JobStatusComponent } from './presentational/job-status/job-status.component';
import { SchedulerTableComponent } from './presentational/scheduler-table/scheduler-table.component';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { ApiSchedulerService } from './services/api-scheduler.service';
import { AuditLogCleanSchedulerService } from './services/audit-log-clean-scheduler.service';
import { XmlSchedulerService } from './services/xml-scheduler.service';

@NgModule({
  imports: [SharedModule, HeaderModule, LayoutModule, SchedulerRoutingModule],
  providers: [ApiSchedulerService, XmlSchedulerService, AuditLogCleanSchedulerService],
  declarations: [
    SchedulerComponent,
    ApiSchedulerComponent,
    EditXmlSchedulerComponent,
    JobIdReadOnlyComponent,
    JobStatusComponent,
    SchedulerTableComponent,
    AuditLogCleanSchedulerTableComponent,
    UserTaskCleanSchedulerStatusComponent
  ]
})
export class SchedulerModule {}
