import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TraitsSharedModule } from 'app/traits/shared/traits-shared.module';
import { NgPipesModule } from 'ngx-pipes';

import { HeaderModule } from '../../main/header/header.module';
import { LayoutModule } from '../../main/layout/layout.module';
import { ServicesSharedModule } from '../../services/shared/services-shared.module';
import { TranslateDataPipe } from '../../shared/pipes/translate-data/translate-data.pipe';
import { SharedModule } from '../../shared/shared.module';

import { TaskDetailContainerComponent } from './task-detail-container/task-detail-container.component';
import { TaskDiffBusinessNameComponent } from './task-detail-container/task-diff-business-name/task-diff-business-name.component';
import { TaskDiffCommunicationComponent } from './task-detail-container/task-diff-communication/task-diff-communication.component';
import { TaskDiffDefaultComponent } from './task-detail-container/task-diff-default/task-diff-default.component';
import { TaskDiffGeneralCommunicationComponent } from './task-detail-container/task-diff-general-communication/task-diff-general-communication.component';
import { TaskDiffItemComponent } from './task-detail-container/task-diff-item/task-diff-item.component';
import { TaskDiffOpeningHoursComponent } from './task-detail-container/task-diff-opening-hours/task-diff-opening-hours.component';
import { TaskInfoComponent } from './task-detail-container/task-info/task-info.component';
import { TaskDetailRoutingModule } from './task-detail-routing.module';
import { TaskDiffService } from './task-diff.service';

@NgModule({
  imports: [
    CommonModule,
    TaskDetailRoutingModule,
    SharedModule,
    ServicesSharedModule,
    LayoutModule,
    HeaderModule,
    NgPipesModule,
    TraitsSharedModule
  ],
  providers: [TaskDiffService, TranslateDataPipe],
  declarations: [
    TaskDetailContainerComponent,
    TaskInfoComponent,
    TaskDiffDefaultComponent,
    TaskDiffBusinessNameComponent,
    TaskDiffOpeningHoursComponent,
    TaskDiffCommunicationComponent,
    TaskDiffGeneralCommunicationComponent,
    TaskDiffItemComponent
  ],
  exports: [TaskInfoComponent]
})
export class TaskDetailModule {}
