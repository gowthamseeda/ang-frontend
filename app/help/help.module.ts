import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SharedModule } from '../shared/shared.module';
import { TaskModule } from '../tasks/task/task.module';

import { HelpRoutingModule } from './help-routing.module';
import { HelpContactComponent } from './help/help-contact/help-contact.component';
import { HelpPdfComponent } from './help/help-pdf/help-pdf.component';
import { HelpTrainingSupportComponent } from './help/help-training-support/help-training-support.component';
import { HelpVideoDialogComponent } from './help/help-video-dialog/help-video-dialog.component';
import { HelpVideoComponent } from './help/help-video/help-video.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    HelpComponent,
    HelpVideoComponent,
    HelpVideoComponent,
    HelpPdfComponent,
    HelpContactComponent,
    HelpVideoDialogComponent,
    HelpTrainingSupportComponent
  ],
  imports: [HelpRoutingModule, CommonModule, SharedModule, LayoutModule, HeaderModule, TaskModule]
})
export class HelpModule {}
