import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OutletRoutingModule } from './outlet-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ViewProfileComponent } from './containers/view-profile/view-profile.component';
import { reducers } from './store/reducers';
import { OutletEffects } from './store/effects/outlet.effects';
import { OutletTileComponent } from './containers/view-profile/outlet-tile/outlet-tile.component';
import { MenuPositionedComponent } from './presentational/view-profile/menu-positioned/menu-positioned.component';
import { OutletIdContentLoaderComponent } from './presentational/view-profile/outlet-id-content-loader/outlet-id-content-loader.component';
import { OutletIdBlockComponent } from './presentational/view-profile/outlet-id-block/outlet-id-block.component';
import { BrandCodeBlocksComponent } from './presentational/view-profile/brand-code-blocks/brand-code-blocks.component';
import { RegisteredOfficeBlockComponent } from './presentational/view-profile/registered-office-block/registered-office-block.component';
import { LegalNameContentLoaderComponent } from './presentational/view-profile/legal-name-content-loader/legal-name-content-loader.component';
import { OutletBuildingComponent } from './presentational/view-profile/outlet-building/outlet-building.component';
import { OutletBuildingLoaderComponent } from './presentational/view-profile/outlet-building-loader/outlet-building-loader.component';
import { ProductGroupGarageComponent } from './presentational/view-profile/outlet-building/product-group-garage/product-group-garage.component';
import { BasicBuildingComponent } from './presentational/view-profile/outlet-building/basic-building/basic-building.component';
import { ServicesTileComponent } from './containers/view-profile/services-tile/services-tile.component';
import { OutletProfileProductCategoryAndServicesComponent } from './presentational/view-profile/outlet-profile-product-category-and-services/outlet-profile-product-category-and-services.component';
import { OutletProfileProductCategoriesComponent } from './presentational/view-profile/outlet-profile-product-categories/outlet-profile-product-categories.component';
import { OutletProfileDataComponent } from './presentational/view-profile/outlet-profile-data/outlet-profile-data.component';
import { OutletProfileDataLoaderComponent } from './presentational/view-profile/outlet-profile-data/outlet-profile-data-loader/outlet-profile-data-loader.component';
import { BrandPyloneComponent } from './presentational/view-profile/brand-pylone/brand-pylone.component';
import { BrandPyloneLoaderComponent } from './presentational/view-profile/brand-pylone-loader/brand-pylone-loader.component';
import { OutletProfileProductCategoryAndServicesLoaderComponent } from './presentational/view-profile/outlet-profile-product-category-and-services-loader/outlet-profile-product-category-and-services-loader.component';
import { OpeningHoursComponent } from './presentational/view-profile/opening-hours/opening-hours.component';
import { OpeningHoursLoaderComponent } from './presentational/view-profile/opening-hours/opening-hours-loader/opening-hours-loader.component';
import { OutletStoreInitializer } from './outlet-store.guard';
import { OutletActionService } from './store/action.service';
import { LayoutModule } from '../main/layout/layout.module';
import { StructuresModule } from '../structures/structures.modules';

@NgModule({
  imports: [
    StoreModule.forFeature('outlet', reducers),
    EffectsModule.forFeature([OutletEffects]),
    OutletRoutingModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    LayoutModule,
    StructuresModule
  ],
  declarations: [
    ViewProfileComponent,
    OutletTileComponent,
    MenuPositionedComponent,
    OutletIdContentLoaderComponent,
    OutletIdBlockComponent,
    BrandCodeBlocksComponent,
    RegisteredOfficeBlockComponent,
    LegalNameContentLoaderComponent,
    OutletBuildingComponent,
    BasicBuildingComponent,
    ProductGroupGarageComponent,
    OutletBuildingLoaderComponent,
    ServicesTileComponent,
    OutletProfileProductCategoryAndServicesComponent,
    OutletProfileProductCategoriesComponent,
    OutletProfileDataComponent,
    OutletProfileDataLoaderComponent,
    BrandPyloneComponent,
    BrandPyloneLoaderComponent,
    OutletProfileProductCategoryAndServicesLoaderComponent,
    OpeningHoursComponent,
    OpeningHoursLoaderComponent
  ],
  providers: [OutletStoreInitializer, OutletActionService]
})
export class OutletModule {}
