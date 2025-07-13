import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { GeographyModule } from '../geography/geography.module';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { MasterBrandModule } from '../master/brand/master-brand/master-brand.module';
import { SearchModule } from '../search/search.module';
import { ServiceVariantDataService } from '../services/service-variant/store/service-variant-data.service';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { ServicesStoreModule } from '../services/store/services-store.module';
import { TranslateDataPipe } from '../shared/pipes/translate-data/translate-data.pipe';
import { SharedModule } from '../shared/shared.module';
import { TraitsSharedModule } from '../traits/shared/traits-shared.module';

import { CountryStructureComponent } from './country-structure-description/presentational/country-structure/country-structure.component';
import { CountryStructureDescriptionApiService } from './country-structure-description/service/country-structure-description-api.service';
import { CountryStructureDescriptionService } from './country-structure-description/service/country-structure-description.service';
import { CountryStructureDescriptionEffects } from './country-structure-description/store/effects/country-structure-description.effects';
import { CountryStructureApiService } from './country-structure/service/country-structure-api.service';
import { CountryStructureService } from './country-structure/service/country-structure.service';
import { AddDealerGroupComponent } from './dealer-groups/container/add-dealer-group/add-dealer-group.component';
import { DealerGroupsComponent } from './dealer-groups/container/dealer-groups/dealer-groups.component';
import { EditDealerGroupComponent } from './dealer-groups/container/edit-dealer-group/edit-dealer-group.component';
import { DealerGroupsService } from './dealer-groups/dealer-groups.service';
import { DealerGroupHeadquarterSelectionComponent } from './dealer-groups/presentational/dealer-group-headquarter-selection/dealer-group-headquarter-selection.component';
import { DealerGroupHeadquarterComponent } from './dealer-groups/presentational/dealer-group-headquarter/dealer-group-headquarter.component';
import { AddGeneralGroupComponent } from './general-groups/container/add-general-group/add-general-group.component';
import { EditGeneralGroupComponent } from './general-groups/container/edit-general-group/edit-general-group.component';
import { GeneralGroupsComponent } from './general-groups/container/general-groups/general-groups.component';
import { GeneralGroupsService } from './general-groups/general-groups.service';
import { BrandProductgroupsServicesSelectionComponent } from './general-groups/presentational/brand-productgroups-services-selection/brand-productgroups-services-selection.component';
import { BrandProductgroupsServicesTableComponent } from './general-groups/presentational/brand-productgroups-services-table/brand-productgroups-services-table.component';
import { MarketAreasComponent } from './market-area/container/market-areas/market-areas.component';
import { MarketStructureService } from './market-structure/market-structure.service';
import { OutletTreeNavigationComponent } from './outlet-structure/container/outlet-tree-navigation/outlet-tree-navigation.component';
import { OutletTreeNavigationService } from './outlet-structure/container/outlet-tree-navigation/outlet-tree-navigation.service';
import { OutletLeadingCodesPipe } from './outlet-structure/pipe/outlet-leading-codes/outlet-leading-codes.pipe';
import { CompanyHeaderComponent } from './outlet-structure/presentational/company/company-header.component';
import { OutletLeadingCodeComponent } from './outlet-structure/presentational/outlet-leading-codes/outlet-leading-codes.component';
import { OutletStructureNodeChipsComponent } from './outlet-structure/presentational/outlet-structure-node-chips/outlet-structure-node-chips.component';
import { OutletStructureNodeComponent } from './outlet-structure/presentational/outlet-structure-node/outlet-structure-node.component';
import { OutletStructureTreeComponent } from './outlet-structure/presentational/outlet-structure-tree/outlet-structure-tree.component';
import { OutletStructureActionService } from './outlet-structure/services/outlet-structure-action.service';
import { OutletStructureApiService } from './outlet-structure/services/outlet-structure-api.service';
import { OutletStructureService } from './outlet-structure/services/outlet-structure.service';
import { DistributionLevelEffects } from './outlet-structure/store/effects/distribution-level.effects';
import { OutletStructureEffects } from './outlet-structure/store/effects/outlet-structure.effects';
import { ViewRegionalCentersComponent } from './regional-center/container/view-regional-centers/view-regional-centers.component';
import { ViewRegionalCentersComponentService } from './regional-center/container/view-regional-centers/view-regional-centers.service';
import { RegionalCenterTableComponent } from './regional-center/presentational/regional-center-table/regional-center-table.component';
import { RegionalCenterActionService } from './regional-center/services/regional-center-action.service';
import { RegionalCenterApiService } from './regional-center/services/regional-center-api.service';
import { RegionalCenterService } from './regional-center/services/regional-center.service';
import { RegionalCenterEffects } from './regional-center/store/effects/regional-center.effects';
import { RegionalCenterStoreGuard } from './regional-center/store/region-center-store.guard';
import { MembersSelectionComponent } from './shared/components/members-selection/members-selection.component';
import { MembersTableComponent } from './shared/components/members-table/members-table.component';
import { RegisteredOfficeMembersTableComponent } from './shared/components/registered-office-members-table/registered-office-members-table.component';
import { SuccessorSelectionComponent } from './shared/components/successor-selection/successor-selection.component';
import { reducers } from './store';
import { StructuresRoutingModule } from './structures-routing.module';
import { StructuresStoreInitializer } from './structures-store.guard';

@NgModule({
    imports: [
        StructuresRoutingModule,
        StoreModule.forFeature('structures', reducers),
        EffectsModule.forFeature([
            OutletStructureEffects,
            DistributionLevelEffects,
            RegionalCenterEffects,
            CountryStructureDescriptionEffects
        ]),
        MatSortModule,
        CommonModule,
        SharedModule,
        HeaderModule,
        LayoutModule,
        TraitsSharedModule,
        GeographyModule,
        ServicesStoreModule,
        SearchModule,
        ServicesSharedModule,
        MasterBrandModule
    ],
    providers: [
        OutletStructureApiService,
        MarketStructureService,
        OutletStructureService,
        OutletTreeNavigationService,
        OutletStructureActionService,
        StructuresStoreInitializer,
        RegionalCenterStoreGuard,
        RegionalCenterActionService,
        RegionalCenterService,
        RegionalCenterApiService,
        GeneralGroupsService,
        ViewRegionalCentersComponentService,
        DealerGroupsService,
        ServiceVariantDataService,
        CountryStructureDescriptionApiService,
        CountryStructureDescriptionService,
        CountryStructureApiService,
        CountryStructureService,
        TranslateDataPipe
    ],
    declarations: [
        CompanyHeaderComponent,
        OutletStructureNodeComponent,
        OutletLeadingCodeComponent,
        OutletStructureTreeComponent,
        OutletTreeNavigationComponent,
        OutletStructureNodeChipsComponent,
        MarketAreasComponent,
        ViewRegionalCentersComponent,
        RegionalCenterTableComponent,
        DealerGroupsComponent,
        GeneralGroupsComponent,
        AddGeneralGroupComponent,
        EditGeneralGroupComponent,
        BrandProductgroupsServicesSelectionComponent,
        BrandProductgroupsServicesTableComponent,
        SuccessorSelectionComponent,
        CountryStructureComponent,
        MembersTableComponent,
        MembersSelectionComponent,
        AddDealerGroupComponent,
        EditDealerGroupComponent,
        DealerGroupHeadquarterComponent,
        DealerGroupHeadquarterSelectionComponent,
        RegisteredOfficeMembersTableComponent,
        OutletLeadingCodesPipe
    ],
    exports: [
        CompanyHeaderComponent,
        OutletStructureNodeComponent,
        OutletLeadingCodeComponent,
        OutletTreeNavigationComponent,
        CountryStructureComponent
    ]
})
export class StructuresModule {}
