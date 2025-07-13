import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { GeographyModule } from '../geography/geography.module';
import { GoogleModule } from '../google/google.module';
import { HistorizationModule } from '../historization/historization.module';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SearchModule } from '../search/search.module';
import { ServicesStoreInitializer } from '../services/services-store.guard';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { SharedModule } from '../shared/shared.module';
import { StructuresModule } from '../structures/structures.modules';
import { TproModule } from '../tpro/tpro.module';
import { TraitsModule } from '../traits/traits.module';
import { UserSettingsModule } from '../user-settings/user-settings.module';

import { ViewOutletComponent } from './businessSite/container/view-outlet/view-outlet.component';
import { AddressLinesContentLoaderComponent } from './businessSite/presentational/view-outlet/address-lines-content-loader/address-lines-content-loader.component';
import { AddressLinesComponent } from './businessSite/presentational/view-outlet/address-lines/address-lines.component';
import { BrandsPillarContentLoaderComponent } from './businessSite/presentational/view-outlet/brands-pillar-content-loader/brands-pillar-content-loader.component';
import { BrandsPillarComponent } from './businessSite/presentational/view-outlet/brands-pillar/brands-pillar.component';
import { BusinessNamesContentLoaderComponent } from './businessSite/presentational/view-outlet/business-names-content-loader/business-names-content-loader.component';
import { BusinessOrLegalNamesComponent } from './businessSite/presentational/view-outlet/business-or-legal-names/business-or-legal-names.component';
import { ChipsContentLoaderComponent } from './businessSite/presentational/view-outlet/chips-content-loader/chips-content-loader.component';
import { ChipsComponent } from './businessSite/presentational/view-outlet/chips/chips.component';
import { GpsTileContentComponent } from './businessSite/presentational/view-outlet/gps-tile-content/gps-tile-content.component';
import { HeaderTileContentComponent } from './businessSite/presentational/view-outlet/header-tile-content/header-tile-content.component';
import { ImageAndTitleComponent } from './businessSite/presentational/view-outlet/image-and-title/image-and-title.component';
import { NoDataInfoComponent } from './businessSite/presentational/view-outlet/no-data-info/no-data-info.component';
import { OutletStatusContentLoaderComponent } from './businessSite/presentational/view-outlet/outlet-id-and-status-content-loader/outlet-id-and-status-content-loader.component';
import { OutletIdAndStatusComponent } from './businessSite/presentational/view-outlet/outlet-id-and-status/outlet-id-and-status.component';
import { PoBoxTileContentComponent } from './businessSite/presentational/view-outlet/po-box-tile-content/po-box-tile-content.component';
import { PropertyValueCellComponent } from './businessSite/presentational/view-outlet/property-value-cell/property-value-cell.component';
import { TileCardComponent } from './businessSite/presentational/view-outlet/tile-card/tile-card.component';
import { BusinessSiteActionService } from './businessSite/services/business-site-action.service';
import { BusinessSiteStoreService } from './businessSite/services/business-site-store.service';
import { NavigationPermissionsService } from './businessSite/services/navigation-permission.service';
import { BrandsEffects } from './businessSite/store/effects/brands.effects';
import { BusinessNamesEffects } from './businessSite/store/effects/business-names.effects';
import { CountryEffects } from './businessSite/store/effects/country.effects';
import { DistributionLevelEffects } from './businessSite/store/effects/distribution-level.effects';
import { OutletEffects } from './businessSite/store/effects/outlet.effects';
import { UserSettingsEffects } from './businessSite/store/effects/user-settings.effects';
import { CloseDownReasonsService } from './close-down-reasons/close-down-reasons.service';
import { CompanyFormComponent } from './company/company-form/company-form.component';
import { CompanyService } from './company/company.service';
import { CreateCompanyComponent } from './company/create-company/create-company.component';
import { EditLegalComponentService } from './legal-information/container/edit-legal/edit-legal-component.service';
import { EditLegalComponent } from './legal-information/container/edit-legal/edit-legal.component';
import { ContractStateLayoutComponent } from './legal-information/presentational/edit-legal/contract-state-layout/contract-state-layout.component';
import { LegalContractStateTableComponent } from './legal-information/presentational/edit-legal/legal-contract-state-table/legal-contract-state-table.component';
import { LegalFooterLayoutComponent } from './legal-information/presentational/edit-legal/legal-footer-layout/legal-footer-layout.component';
import { TaxIdLayoutComponent } from './legal-information/presentational/edit-legal/tax-id-layout/tax-id-layout.component';
import { TaxNumberInputComponent } from './legal-information/presentational/edit-legal/tax-number-input/tax-number-input.component';
import { VatNumberInputComponent } from './legal-information/presentational/edit-legal/vat-number-input/vat-number-input.component';
import { LegalInformationActionService } from './legal-information/services/legal-information-action.service';
import { LegalInformationApiService } from './legal-information/services/legal-information-api.service';
import { ContractStatusEffects } from './legal-information/store/effects/contract-status.effects';
import { LegalInformationEffects } from './legal-information/store/effects/legal-information.effects';
import { LegalInformationSavingStatusEffects } from './legal-information/store/effects/saving-status-effects';
import { LegalInformationStoreGuard } from './legal-information/store/legal-information-store.guard';
import { LegalStructureRoutingModule } from './legal-structure-routing.module';
import { LegalStructureStoreInitializer } from './legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from './legal-structure-test-outlet.guard';
import { LocationService } from './location/services/location-service.model';
import { OutletRelationshipsComponent } from './outlet-relationships/container/outlet-relationships/outlet-relationships.component';
import { OutletRelationshipsDropdownComponent } from './outlet-relationships/presentational/outlet-relationships-dropdown/outlet-relationships-dropdown.component';
import { OutletRelationshipsTableComponent } from './outlet-relationships/presentational/outlet-relationships-table/outlet-relationships-table.component';
import { OutletSelectionComponent } from './outlet-relationships/presentational/outlet-selection/outlet-selection.component';
import { OutletRelationshipsService } from './outlet-relationships/services/outlet-relationships.service';
import { CreateOutletComponent } from './outlet/create-outlet/create-outlet.component';
import { EditOutletComponent } from './outlet/edit-outlet/edit-outlet.component';
import { CountryStructureFormComponent } from './outlet/edit-outlet/outlet-form/country-structure-form/country-structure-form.component';
import { OutletFormComponent } from './outlet/edit-outlet/outlet-form/outlet-form.component';
import { OutletTranslationAddressComponent } from './outlet/edit-outlet/outlet-form/outlet-translation-address/outlet-translation-address.component';
import { OutletTranslationPoBoxComponent } from './outlet/edit-outlet/outlet-form/outlet-translation-po-box/outlet-translation-po-box.component';
import { OutletAddressComponent } from './outlet/outlet-address/outlet-address.component';
import { PredecessorModule } from './predecessor/predecessor.module';
import { AddButtonComponent } from './shared/components/add-button/add-button.component';
import { AdditionalContentComponent } from './shared/components/additional-content/additional-content.component';
import { AddressAdditionComponent } from './shared/components/address/address-addition/address-addition.component';
import { AddressComponent } from './shared/components/address/address.component';
import { CityComponent } from './shared/components/address/city/city.component';
import { DistrictComponent } from './shared/components/address/district/district.component';
import { StreetNumberComponent } from './shared/components/address/street-number/street-number.component';
import { StreetComponent } from './shared/components/address/street/street.component';
import { ZipCodeComponent } from './shared/components/address/zip-code/zip-code.component';
import { CountryComponent } from './shared/components/country/country.component';
import { DistributionLevelComponent } from './shared/components/distribution-level/distribution-level.component';
import { AddressComparisonComponent } from './shared/components/gps/address-comparison/address-comparison.component';
import { GpsComponent } from './shared/components/gps/gps.component';
import { ActiveLanguageService } from './shared/components/language-toggle/active-language.service';
import { LanguageToggleComponent } from './shared/components/language-toggle/language-toggle.component';
import { LegalNameComponent } from './shared/components/legal-name/legal-name.component';
import { LegalStatusOfCompanyComponent } from './shared/components/legal-status-of-company/legal-status-of-company.component';
import { NameAdditionComponent } from './shared/components/name-addition/name-addition.component';
import { PoBoxCityComponent } from './shared/components/po-box/po-box-city/po-box-city.component';
import { PoBoxNumberComponent } from './shared/components/po-box/po-box-number/po-box-number.component';
import { PoBoxZipCodeComponent } from './shared/components/po-box/po-box-zip-code/po-box-zip-code.component';
import { PoBoxComponent } from './shared/components/po-box/po-box.component';
import { ProvinceComponent } from './shared/components/province/province.component';
import { StateComponent } from './shared/components/state/state.component';
import { StatusComponent } from './shared/components/status/status.component';
import { MessageService } from './shared/services/message.service';
import { reducers } from './store';
import { CompanyTileComponent } from './tiles/company-tile/company-tile.component';
import { VerificationRequestComponent } from './verification-request/container/verification-request.component';
import {
  MasterOutletRelationshipService
} from '../master/services/master-outlet-relationship/master-outlet-relationship.service';
import {TasksModule} from "../tasks/tasks.module";
import { TaskInputTextComponent } from './shared/components/task-input/task-input-text.component';
import { BaseData4rService } from './outlet/base-data-4r.service';

@NgModule({
    imports: [
        LegalStructureRoutingModule,
        StoreModule.forFeature('legalStructure', reducers),
        EffectsModule.forFeature([
            OutletEffects,
            CountryEffects,
            DistributionLevelEffects,
            UserSettingsEffects,
            LegalInformationEffects,
            LegalInformationSavingStatusEffects,
            ContractStatusEffects,
            BusinessNamesEffects,
            BrandsEffects
        ]),
        GeographyModule,
        SharedModule,
        UserSettingsModule,
        LayoutModule,
        SearchModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        TraitsModule,
        GoogleModule,
        StructuresModule,
        TproModule,
        HistorizationModule,
        HeaderModule,
        PredecessorModule,
        ServicesSharedModule,
        TasksModule
    ],
    exports: [
        TileCardComponent,
        OutletIdAndStatusComponent,
        OutletStatusContentLoaderComponent,
        HeaderTileContentComponent,
        AddressLinesComponent,
        AddressLinesContentLoaderComponent,
        BusinessOrLegalNamesComponent,
        BusinessNamesContentLoaderComponent,
        ChipsComponent,
        BrandsPillarComponent,
        BrandsPillarContentLoaderComponent,
        GpsTileContentComponent,
        ImageAndTitleComponent,
        PoBoxTileContentComponent,
        NoDataInfoComponent,
        PropertyValueCellComponent
    ],
    declarations: [
        AddressComponent,
        CompanyFormComponent,
        CreateCompanyComponent,
        CreateOutletComponent,
        ViewOutletComponent,
        EditOutletComponent,
        CompanyTileComponent,
        LanguageToggleComponent,
        DistributionLevelComponent,
        LegalStatusOfCompanyComponent,
        OutletFormComponent,
        StatusComponent,
        OutletAddressComponent,
        LegalNameComponent,
        NameAdditionComponent,
        StateComponent,
        ProvinceComponent,
        CountryComponent,
        PoBoxComponent,
        GpsComponent,
        StreetComponent,
        StreetNumberComponent,
        AddressAdditionComponent,
        ZipCodeComponent,
        CityComponent,
        DistrictComponent,
        OutletTranslationAddressComponent,
        PoBoxNumberComponent,
        PoBoxZipCodeComponent,
        PoBoxCityComponent,
        OutletTranslationPoBoxComponent,
        AddressComparisonComponent,
        TileCardComponent,
        OutletIdAndStatusComponent,
        OutletStatusContentLoaderComponent,
        HeaderTileContentComponent,
        AddressLinesComponent,
        AddressLinesContentLoaderComponent,
        BusinessOrLegalNamesComponent,
        BusinessNamesContentLoaderComponent,
        ChipsComponent,
        BrandsPillarComponent,
        BrandsPillarContentLoaderComponent,
        GpsTileContentComponent,
        ImageAndTitleComponent,
        PoBoxTileContentComponent,
        NoDataInfoComponent,
        PropertyValueCellComponent,
        ChipsContentLoaderComponent,
        ChipsContentLoaderComponent,
        AdditionalContentComponent,
        EditLegalComponent,
        TaxIdLayoutComponent,
        VatNumberInputComponent,
        TaxNumberInputComponent,
        LegalFooterLayoutComponent,
        ContractStateLayoutComponent,
        AddButtonComponent,
        LegalContractStateTableComponent,
        CountryStructureFormComponent,
        VerificationRequestComponent,
        OutletRelationshipsComponent,
        OutletRelationshipsTableComponent,
        OutletRelationshipsDropdownComponent,
        OutletSelectionComponent,
        TaskInputTextComponent
    ],
    providers: [
        CompanyService,
        CloseDownReasonsService,
        LocationService,
        MessageService,
        ActiveLanguageService,
        BusinessSiteStoreService,
        LegalStructureStoreInitializer,
        ServicesStoreInitializer,
        BusinessSiteActionService,
        EditLegalComponentService,
        LegalInformationApiService,
        LegalInformationStoreGuard,
        LegalInformationActionService,
        NavigationPermissionsService,
        OutletRelationshipsService,
        LegalStructureTestOutletGuard,
        MasterOutletRelationshipService,
        BaseData4rService
    ]
})
export class LegalStructureModule {}
