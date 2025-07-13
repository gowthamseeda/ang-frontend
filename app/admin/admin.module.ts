import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SearchModule } from '../search/search.module';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { FileUploadStatusComponent } from './file-upload-status/container/file-upload-status.component';
import { FileUploadStatusService } from './file-upload-status/file-upload-status.service';
import { MoveOutletComponent } from './move-outlet/container/move-outlet/move-outlet.component';
import { OutletDetailsComponent } from './shared/presentational/outlet-details/outlet-details.component';
import { OutletInformationComponent } from './shared/presentational/outlet-information/outlet-information.component';
import { OutletSearchSelectionComponent } from './shared/presentational/outlet-search-selection/outlet-search-selection.component';
import { SummaryTableComponent } from './shared/presentational/summary-table/summary-table.component';
import { OutletSearchService } from './shared/service/outlet-search.service';
import { SwitchRegisteredOfficeComponent } from './switch-registered-office/container/switch-registered-office/switch-registered-office.component';
import { ExternalKeysDownloadComponent } from './key-maintenance/container/external-keys-download/external-keys-download.component';
import { ExternalKeysUploadComponent } from "./key-maintenance/container/external-keys-upload/external-keys-upload.component";
import { KeyMaintenanceComponent } from './key-maintenance/container/key-maintenance/key-maintenance.component';
import { ExternalKeysService } from "../gssnplus-api-outlet/external-keys/external-keys";
import { GeographyModule } from "../geography/geography.module";
import { MasterBrandDataService } from "../master/brand/master-brand/store/master-brand-data.service";
import {
  MasterProductGroupService
} from "../master/product-group/master-product-group/master-product-group.service";
import {
  MasterProductGroupCollectionService
} from '../master/product-group/master-product-group/store/master-product-group-collection.service';
import { TraitsModule } from "../traits/traits.module";
import { MasterModule } from "../master/master.module";
import { MasterKeyService } from '../master/services/master-key/master-key.service';

@NgModule({
  declarations: [
    MoveOutletComponent,
    SummaryTableComponent,
    OutletSearchSelectionComponent,
    OutletDetailsComponent,
    OutletInformationComponent,
    SwitchRegisteredOfficeComponent,
    FileUploadStatusComponent,
    ExternalKeysDownloadComponent,
    ExternalKeysUploadComponent,
    KeyMaintenanceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    LayoutModule,
    HeaderModule,
    SearchModule,
    GeographyModule,
    TraitsModule,
    MasterModule,
  ],
  providers: [
    OutletSearchService,
    FileUploadStatusService,
    ExternalKeysService,
    MasterBrandDataService,
    MasterProductGroupService,
    MasterProductGroupCollectionService,
    MasterKeyService
  ]
})
export class AdminModule {}
