import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { CompModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { StructuresModule } from '../structures/structures.modules';

import { EditOpeningHoursComponent } from './container/edit-opening-hours/edit-opening-hours.component';
import { OpeningHoursMultiEditComponent } from './container/opening-hours-multi-edit/opening-hours-multi-edit.component';
import { OpeningHoursRoutingModule } from './opening-hours-routing.module';
import { OpeningHoursService } from './opening-hours.service';
import { OpeningHoursStoreInitializer } from './opening-hours.store.guard';
import { BrandProductGroupTableGroupedHeaderComponent } from './presentational/brand-product-group-table/brand-product-group-table-grouped-header/brand-product-group-table-grouped-header.component';
import { BrandProductGroupTableComponent } from './presentational/brand-product-group-table/brand-product-group-table.component';
import { WeekdayColumnComponent } from './presentational/brand-product-group-table/weekday-column/weekday-column.component';
import { CalendarComponent } from './presentational/calendar/calendar.component';
import { CellComponent } from './presentational/calendar/cell/cell.component';
import { MonthNavigationComponent } from './presentational/calendar/month-navigation/month-navigation.component';
import { MonthComponent } from './presentational/calendar/month/month.component';
import { YearNavigationComponent } from './presentational/calendar/year-navigation/year-navigation.component';
import { CloseOpeningHourComponent } from './presentational/close-opening-hour/close-opening-hour.component';
import { EventListItemComponent } from './presentational/event-list-item/event-list-item.component';
import { OpeningHourInputComponent } from './presentational/opening-hour-input/opening-hour-input.component';
import { PlusMinusComponent } from './presentational/plus-minus/plus-minus.component';
import { SpecialOpeningHoursChipComponent } from './presentational/special-opening-hour-chip/special-opening-hours-chip.component';
import { OpeningHoursConverterService } from './services/opening-hours-converter.service';
import { OpeningHoursPermissionService } from './services/opening-hours-permission.service';
import { BrandProductGroupOpeningHoursEffects } from './store/effects/brand-product-group-opening-hours.effects';
import { OpeningHoursTaskEffects } from './store/effects/opening-hours-task.effects';
import { reducers } from './store/reducers';
import { OpeningHoursStoreService } from './store/store.service';
import { OpeningHoursConfirmationComponent } from './presentational/opening-hours-confirmation/opening-hours-confirmation.component';
import { OpeningHoursTaskNotificationComponent } from "./container/opening-hours-task-notification/opening-hours-task-notification.component";
import { OpeningHourTasksCommentComponent } from "./container/opening-hours-tasks-comment/opening-hour-tasks-comment-component";

@NgModule({
  declarations: [
    BrandProductGroupTableComponent,
    EditOpeningHoursComponent,
    OpeningHoursMultiEditComponent,
    BrandProductGroupTableGroupedHeaderComponent,
    OpeningHourInputComponent,
    PlusMinusComponent,
    CloseOpeningHourComponent,
    CellComponent,
    MonthComponent,
    CalendarComponent,
    MonthNavigationComponent,
    YearNavigationComponent,
    EventListItemComponent,
    SpecialOpeningHoursChipComponent,
    WeekdayColumnComponent,
    OpeningHoursConfirmationComponent,
    OpeningHoursTaskNotificationComponent,
    OpeningHourTasksCommentComponent
  ],
  providers: [
    OpeningHoursService,
    OpeningHoursPermissionService,
    OpeningHoursConverterService,
    OpeningHoursStoreService,
    OpeningHoursStoreInitializer
  ],
  imports: [
    StoreModule.forFeature('openingHours', reducers),
    EffectsModule.forFeature([BrandProductGroupOpeningHoursEffects, OpeningHoursTaskEffects]),
    OpeningHoursRoutingModule,
    CommonModule,
    CompModule,
    SharedModule,
    LayoutModule,
    CdkTableModule,
    HeaderModule,
    NgxMaterialTimepickerModule,
    ServicesSharedModule,
    StructuresModule
  ],
  exports: [CalendarComponent]
})
export class OpeningHoursModule {}
