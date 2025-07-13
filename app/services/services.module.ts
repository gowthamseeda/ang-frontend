import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { LegalStructureModule } from '../legal-structure/legal-structure.module';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { VirtualScrollTableModule } from '../shared/directives/virtual-scroll-table/virtual-scroll-table.module';
import { KeysPipe } from '../shared/pipes/keys/keys.pipe';
import { SharedModule } from '../shared/shared.module';
import { StructuresModule } from '../structures/structures.modules';

import { OfferedServiceService } from './offered-service/offered-service.service';
import { ServiceVariantService } from './service-variant/service-variant.service';
import { ServiceVariantDataService } from './service-variant/store/service-variant-data.service';
import { CopyOfferedServiceComponent } from './service/containers/copy-offered-service/copy-offered-service.component';
import { MultiSelectActionsComponent } from './service/containers/multi-select-actions/multi-select-actions.component';
import { MultiSelectServiceIconsComponent } from './service/containers/multi-select-service-icons/multi-select-service-icons.component';
import { OfferedServiceComponent } from './service/containers/offered-service/offered-service.component';
import { ServiceActionIconsComponent } from './service/containers/service-action-icons/service-action-icons.component';
import { ServiceActionTabsComponent } from './service/containers/service-action-tabs/service-action-tabs.component';
import { ServiceConfirmationComponent } from './service/containers/service-confirmation/service-confirmation.component';
import { ServiceFilterDialogComponent } from './service/containers/service-filter-dialog/service-filter-dialog.component';
import { ServiceTableNameCellComponent } from './service/containers/service-table-name-cell/service-table-name-cell.component';
import { ServiceTableComponent } from './service/containers/service-table/service-table.component';
import { ServiceComponent } from './service/containers/service/service.component';
import { CopyServiceCellToggleComponent } from './service/presentational/copy-service-cell-toggle/copy-service-cell-toggle.component';
import { ServiceCellToggleComponent } from './service/presentational/service-cell-toggle/service-cell-toggle.component';
import { ServiceTableLayoutComponent } from './service/presentational/service-table-layout/service-table-layout.component';
import { ServiceTableFilterService } from './service/services/service-table-filter.service';
import { ServiceTableSettingService } from './service/services/service-table-setting.service';
import { ServiceTableService } from './service/services/service-table.service';
import { ServiceService } from './service/services/service.service';
import { ServicesRoutingModule } from './services-routing.module';
import { ServicesStoreInitializer } from './services-store.guard';
import { ServicesGuard } from './services.guard';
import { ServicesSharedModule } from './shared/services-shared.module';
import { ServicesStoreModule } from './store/services-store.module';
import { ValidityModule } from './validity/validity.module';
import {
  ServiceDetailDialogComponent
} from './service/containers/service-detail-dialog/service-detail-dialog.component';
import { QuillEditorComponent, QuillViewComponent } from 'ngx-quill';
import { MasterServiceModule } from 'app/master/service/master-service/master-service.module';

@NgModule({
  imports: [
    StructuresModule,
    ServicesRoutingModule,
    ServicesStoreModule,
    LegalStructureModule,
    CommonModule,
    SharedModule,
    ServicesSharedModule,
    LayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ValidityModule,
    HeaderModule,
    TranslateModule,
    VirtualScrollTableModule,
    QuillViewComponent,
    QuillEditorComponent,
    MasterServiceModule
  ],
    declarations: [
        ServiceComponent,
        ServiceTableComponent,
        ServiceTableLayoutComponent,
        OfferedServiceComponent,
        ServiceCellToggleComponent,
        ServiceTableNameCellComponent,
        ServiceActionTabsComponent,
        ServiceActionIconsComponent,
        ServiceFilterDialogComponent,
        ServiceDetailDialogComponent,
        CopyServiceCellToggleComponent,
        CopyOfferedServiceComponent,
        MultiSelectActionsComponent,
        MultiSelectServiceIconsComponent,
        ServiceConfirmationComponent
    ],
    providers: [
        ServiceService,
        OfferedServiceService,
        ServiceVariantDataService,
        ServiceVariantService,
        ServiceTableService,
        ServicesGuard,
        ServicesStoreInitializer,
        KeysPipe,
        ServiceTableFilterService,
        ServiceTableSettingService
    ]
})
export class ServicesModule {
  constructor() {}
}
