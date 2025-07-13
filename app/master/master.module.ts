import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { VirtualScrollTableModule } from '../shared/directives/virtual-scroll-table/virtual-scroll-table.module';
import { KeysPipe } from '../shared/pipes/keys/keys.pipe';
import { SharedModule } from '../shared/shared.module';

import { BrandPriorityComponent } from './brand/brand-priority/brand-priority.component';
import { CreateBrandComponent } from './brand/create-brand/create-brand.component';
import { MasterBrandModule } from './brand/master-brand/master-brand.module';
import { UpdateBrandComponent } from './brand/update-brand/update-brand.component';
import { CreateCloseDownReasonComponent } from './close-down-reason/create-close-down-reason/create-close-down-reason.component';
import { UpdateCloseDownReasonComponent } from './close-down-reason/update-close-down-reason/update-close-down-reason.component';
import { CreateCountryGroupComponent } from './country-group/create-country-group/create-country-group.component';
import { UpdateCountryGroupComponent } from './country-group/update-country-group/update-country-group.component';
import { CreateCountryComponent } from './country/create-country/create-country.component';
import { MasterCountryModule } from './country/master-country/master-country.module';
import { TimezoneService } from './country/timezone.service';
import { UpdateCountryComponent } from './country/update-country/update-country.component';
import { CreateKeyTypeComponent } from './key-type/create-key-type/create-key-type.component';
import { UpdateKeyTypeComponent } from './key-type/update-key-type/update-key-type.component';
import { CreateLabelComponent } from './label/create-label/create-label.component';
import { UpdateLabelComponent } from './label/update-label/update-label.component';
import { CreateLanguageComponent } from './language/create-language/create-language.component';
import { MasterLanguageModule } from './language/master-language/master-language.module';
import { MasterLanguageService } from './language/master-language/master-language.service';
import { UpdateLanguageComponent } from './language/update-language/update-language.component';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { CreateProductGroupComponent } from './product-group/create-product-group/create-product-group.component';
import { MasterProductGroupModule } from './product-group/master-product-group/master-product-group.module';
import { MasterProductGroupService } from './product-group/master-product-group/master-product-group.service';
import { UpdateProductGroupComponent } from './product-group/update-product-group/update-product-group.component';
import { CreateServiceComponent } from './service/create-service/create-service.component';
import { MasterServiceModule } from './service/master-service/master-service.module';
import { MasterServiceService } from './service/master-service/master-service.service';
import { ServicePriorityComponent } from './service/service-priority/service-priority.component';
import { ConfigureServiceVariantComponent } from './service/service-variants/containers/configure-service-variant/configure-service-variant.component';
import { ServiceVariantComponent } from './service/service-variants/containers/service-variants/service-variant.component';
import { MasterServiceVariantModule } from './service/service-variants/master-service-variant/master-service-variant.module';
import { ServiceVariantConfigureTableComponent } from './service/service-variants/presentational/service-variant-configure-table/service-variant-configure-table.component';
import { ServiceVariantCountryDragDropComponent } from './service/service-variants/presentational/service-variant-country-drag-drop/service-variant-country-drag-drop.component';
import { ServiceVariantDeleteDialogComponent } from './service/service-variants/presentational/service-variant-delete-dialog/service-variant-delete-dialog.component';
import { ServiceVariantFilterDialogComponent } from './service/service-variants/presentational/service-variant-filter-dialog/service-variant-filter-dialog.component';
import { ServiceVariantMultiActionsComponent } from './service/service-variants/presentational/service-variant-multi-actions/service-variant-multi-actions.component';
import { ServiceVariantTableComponent } from './service/service-variants/presentational/service-variant-table/service-variant-table.component';
import { ServiceVariantViewDialogComponent } from './service/service-variants/presentational/service-variant-view-dialog/service-variant-view-dialog.component';
import { ServiceVariantFilterService } from './service/service-variants/services/service-variant-filter.service';
import { ServiceVariantRouteDataService } from './service/service-variants/services/service-variant-route-data.service';
import { BrandSelectorComponent } from './service/service-variants/shared/presentational/brand-selector/brand-selector.component';
import { ProductGroupSelectorComponent } from './service/service-variants/shared/presentational/product-group-selector/product-group-selector.component';
import { ServiceSelectorComponent } from './service/service-variants/shared/presentational/service-selector/service-selector.component';
import { UpdateServiceComponent } from './service/update-service/update-service.component';
import { MasterCloseDownReasonsService } from './services/master-close-down-reasons/master-close-down-reasons.service';
import { MasterCountryGroupService } from './services/master-country-group/master-country-group.service';
import { MasterKeyService } from './services/master-key/master-key.service';
import { MasterLabelService } from './services/master-label/master-label.service';
import { BrandSelectionComponent } from './shared/brand-selection/brand-selection.component';
import { ChipsSelectionComponent } from './shared/chips-selection/chips-selection.component';
import { DistributionSelectionComponent } from './shared/distribution-selection/distribution-selection.component';
import { MasterTileComponent } from './shared/master-tile/master-tile.component';
import { FilterPipe } from './shared/pipes/filter/filter.pipe';
import { PositionControlComponent } from './shared/position-control/position-control.component';
import { ProductGroupSelectionComponent } from './shared/product-group-selection/product-group-selection.component';
import { LanguageDropdownComponent } from './shared/translation/language-dropdown/language-dropdown.component';
import { TranslationDialogComponent } from './shared/translation/translation-dialog/translation-dialog.component';
import { TranslationTableComponent } from './shared/translation/translation-table/translation-table.component';
import { BrandTileComponent } from './tiles/brand-tile/brand-tile.component';
import { CloseDownReasonTileComponent } from './tiles/close-down-reason-tile/close-down-reason-tile.component';
import { CountryGroupTileComponent } from './tiles/country-group-tile/country-group-tile.component';
import { CountryTileComponent } from './tiles/country-tile/country-tile.component';
import { KeyTileComponent } from './tiles/key-tile/key-tile.component';
import { LabelTileComponent } from './tiles/label-tile/label-tile.component';
import { LanguageTileComponent } from './tiles/language-tile/language-tile.component';
import { ProductGroupTileComponent } from './tiles/product-group-tile/product-group-tile.component';
import { ServiceTileComponent } from './tiles/service-tile/service-tile.component';
import { TranslationDialogKeyComponent } from './key-type/translation/translation-dialog-key/translation-dialog-key.component';
import { TranslationTableKeyComponent } from './key-type/translation/translation-table-key/translation-table-key.component';
import { LanguageDropdownKeyComponent } from './key-type/translation/language-dropdown-key/language-dropdown-key.component';
import { OutletRelationshipTileComponent } from './tiles/outlet-relationship-tile/outlet-relationship-tile.component';
import { CreateOutletRelationshipComponent } from './outlet-relationship/create-outlet-relationship/create-outlet-relationship.component';
import { UpdateOutletRelationshipComponent } from "./outlet-relationship/update-outlet-relationship/update-outlet-relationship.component";
import { MasterOutletRelationshipService } from "./services/master-outlet-relationship/master-outlet-relationship.service";
import { RetailCountryTileComponent } from './tiles/retail-country-tile/retail-country-tile.component';
import { MasterRetailCountryService } from './services/master-retail-country/master-retail-country.service';
import { CreateRetailCountryComponent } from './retail-country/create-retail-country/create-retail-country.component';
import { UpdateRetailCountryComponent } from './retail-country/update-retail-country/update-retail-country.component';
import { QuillEditorComponent } from "ngx-quill";

@NgModule({
  imports: [
    VirtualScrollTableModule,
    LayoutModule,
    MasterRoutingModule,
    SharedModule,
    ServicesSharedModule,
    DragDropModule,
    MasterServiceVariantModule,
    MasterProductGroupModule,
    MasterBrandModule,
    MasterServiceModule,
    MasterCountryModule,
    MasterLanguageModule,
    HeaderModule,
    QuillEditorComponent
  ],
  providers: [
    TimezoneService,
    MasterCloseDownReasonsService,
    MasterLanguageService,
    MasterLabelService,
    MasterKeyService,
    MasterOutletRelationshipService,
    MasterServiceService,
    MasterCountryGroupService,
    KeysPipe,
    ServiceVariantFilterService,
    MasterProductGroupService,
    ServiceVariantRouteDataService,
    MasterRetailCountryService,
  ],
  declarations: [
    BrandTileComponent,
    CreateBrandComponent,
    CreateCountryComponent,
    CountryTileComponent,
    MasterComponent,
    MasterTileComponent,
    UpdateBrandComponent,
    UpdateCountryComponent,
    FilterPipe,
    LanguageTileComponent,
    CreateLanguageComponent,
    UpdateLanguageComponent,
    ProductGroupTileComponent,
    CreateProductGroupComponent,
    UpdateProductGroupComponent,
    ServiceTileComponent,
    CreateServiceComponent,
    UpdateServiceComponent,
    CreateCloseDownReasonComponent,
    UpdateCloseDownReasonComponent,
    CloseDownReasonTileComponent,
    ChipsSelectionComponent,
    BrandPriorityComponent,
    ServicePriorityComponent,
    PositionControlComponent,
    LabelTileComponent,
    KeyTileComponent,
    CreateLabelComponent,
    UpdateLabelComponent,
    CountryGroupTileComponent,
    CreateCountryGroupComponent,
    UpdateCountryGroupComponent,
    ServiceVariantComponent,
    ServiceVariantTableComponent,
    ServiceVariantFilterDialogComponent,
    ConfigureServiceVariantComponent,
    ServiceVariantCountryDragDropComponent,
    ServiceVariantDeleteDialogComponent,
    ServiceVariantConfigureTableComponent,
    BrandSelectorComponent,
    ServiceSelectorComponent,
    ProductGroupSelectorComponent,
    DistributionSelectionComponent,
    ServiceVariantViewDialogComponent,
    ServiceVariantMultiActionsComponent,
    TranslationTableComponent,
    TranslationDialogComponent,
    CreateKeyTypeComponent,
    UpdateKeyTypeComponent,
    BrandSelectionComponent,
    ProductGroupSelectionComponent,
    LanguageDropdownComponent,
    TranslationDialogKeyComponent,
    TranslationTableKeyComponent,
    LanguageDropdownKeyComponent,
    OutletRelationshipTileComponent,
    CreateOutletRelationshipComponent,
    UpdateOutletRelationshipComponent,
    RetailCountryTileComponent,
    CreateRetailCountryComponent,
    UpdateRetailCountryComponent
  ]
})
export class MasterModule {}
