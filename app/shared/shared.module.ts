

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { NgxPermissionsModule } from 'ngx-permissions';

import { IamSharedModule } from '../iam/shared/iam-shared.module';
import { TasksSharedModule } from '../tasks/shared/tasks-shared.module';

import { CompModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.model';
import { DistributionLevelGuard } from './guards/distribution-level-guard.model';
import { FeatureToggleGuard } from './guards/feature-toggle-guard.model';
import { MaterialModule } from './material/material.module';
import { MatomoEventTracker } from './matomo/event-tracker.model';
import { PipesModule } from './pipes/pipes.module';
import { ServicesModule } from './services/services.module';

@NgModule({
  imports: [CommonModule, TasksSharedModule, IamSharedModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    DirectivesModule,
    MaterialModule,
    PipesModule,
    ServicesModule,
    CompModule,
    NgxPermissionsModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    ContentLoaderModule,
    OverlayModule,
    TasksSharedModule,
    IamSharedModule
  ],
  providers: [MatomoEventTracker, CanDeactivateGuard, DistributionLevelGuard, FeatureToggleGuard]
})
export class SharedModule {}
